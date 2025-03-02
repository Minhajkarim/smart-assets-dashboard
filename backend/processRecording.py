#!/usr/bin/env python
import cv2
import sys
import os
import json
import logging
import subprocess
import re
import pandas as pd

from YOLO_Pred import YOLO_Pred
from postProcess import deduplicate_objects, total_distance_km, cleanup_images


def get_format_by_extension(file_path):
    _, ext = os.path.splitext(file_path)
    return ext.lower().replace('.', '') if ext else 'unknown'


def convert_time_to_seconds(time_str):
    """
    Converts a time string in the format hh:mm:ss.ms to seconds.

    Args:
        time_str (str): Time string to convert.

    Returns:
        float: Time in seconds.
    """
    h, m, s = map(float, time_str.split(':'))
    return h * 3600 + m * 60 + s


def convert_webm_to_mp4(input_path, output_path, preset='fast', crf=22):
    """
    Converts a WebM video file to MP4 format using FFmpeg.

    Args:
        input_path (str): Path to the source WebM video file.
        output_path (str): Path where the converted MP4 video will be saved.
        preset (str, optional): FFmpeg preset for encoding speed and compression.
                                Options include: ultrafast, superfast, veryfast, faster,
                                fast, medium (default), slow, slower, veryslow.
        crf (int, optional): Constant Rate Factor for controlling video quality.
                             Lower values mean higher quality. Range: 0-51 (default: 22).

    Returns:
        bool: True if conversion is successful, False otherwise.
    """

    # Validate input file existence
    if not os.path.isfile(input_path):
        print(json.dumps(
            {'message': f"Error: Input file '{input_path}' not found."}))
        return False

    # Ensure the output directory exists
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir, exist_ok=True)
            print(json.dumps(
                {'message': f"Created output directory '{output_dir}'.", progress: {
                    'progress': 1,
                    'message': 'Creating output directory...'}
                 }))

        except Exception as e:
            print(json.dumps(
                {'message': f"Error creating output directory '{output_dir}': {str(e)}"}))
            return False

    # Construct the FFmpeg command
    # ffmpeg_command = [
    #     'ffmpeg',
    #     '-i', input_path,          # Input file
    #     '-c:v', 'libx264',         # Video codec
    #     '-preset', preset,         # Preset for encoding speed and compression
    #     '-crf', str(crf),          # Constant Rate Factor for quality
    #     '-c:a', 'aac',             # Audio codec
    #     '-b:a', '128k',            # Audio bitrate
    #     # Enables fast start for MP4 (progressive download)
    #     '-movflags', '+faststart',
    #     '-y',                      # Overwrite output file without asking
    #     output_path                # Output file
    # ]
    ffmpeg_command = [
        'ffmpeg',
        '-i', input_path,                    # Input file
        '-c:v', 'h264_nvenc',                 # Use NVIDIA NVENC H.264 encoder
        # NVENC presets: slow, medium, fast, etc.
        '-preset', 'fast',
        '-rc', 'vbr',                         # Rate control: CBR, VBR, etc.
        # Constant Quality (similar to CRF)
        '-cq', str(crf),
        '-b:v', '0',                           # Bitrate (0 for CQ mode)
        '-c:a', 'aac',                        # Audio codec
        '-b:a', '128k',                       # Audio bitrate
        # Enables fast start for MP4 (progressive download)
        '-movflags', '+faststart',
        '-y',                                  # Overwrite output file without asking
        # '-report',
        output_path                            # Output file
    ]

    print(json.dumps({'message': 'Converting WebM to MP4...',
                      'progress': 0,
                      'message': 'Converting WebM to MP4...'
                      }))

    try:
        # Execute the FFmpeg command
        process = subprocess.run(
            ffmpeg_command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )

        # Optionally, you can log or print FFmpeg's output
        # print(process.stdout)
        # print(process.stderr)

        # Patterns for parsing FFmpeg output
        duration_pattern = re.compile(
            r"Duration: (\d+:\d+:\d+\.\d+)")  # Total duration
        progress_pattern = re.compile(
            r"time=(\d+:\d+:\d+\.\d+)")       # Current progress time

        total_duration = None

        for line in process.stderr:
            # Check for total duration in the FFmpeg output
            if not total_duration:
                match = duration_pattern.search(line)
                if match:
                    total_duration = convert_time_to_seconds(match.group(1))
                    print(json.dumps({
                        'progress': 0,
                        'message': f"Converting WebM to Mp4 - Total duration detected: {match.group(1)}"
                    }))

            # Parse progress updates
            match = progress_pattern.search(line)
            if match and total_duration:
                elapsed_time = convert_time_to_seconds(match.group(1))
                progress_percent = (elapsed_time / total_duration) * 100
                print(json.dumps({
                    'progress': round(progress_percent, 2),
                    'message': f"Converting WebM to Mp4 - {match.group(1)} elapsed."
                }))

        print(json.dumps({'message': 'Conversion completed successfully.',
                          'progress': 100,
                          'message': 'Conversion completed successfully.'
                          }))
        print(json.dumps({
            'progress': 5,
            'message': 'Proceesing video...'
        }))
        return output_path

    except subprocess.CalledProcessError as e:
        # Handle errors in FFmpeg execution
        print(json.dumps(
            {'message': f"Error converting WebM to MP4: {e.stderr}"}))
        print(e.stderr)
        return None

    except FileNotFoundError:
        # FFmpeg is not installed or not found in PATH
        print(json.dumps(
            {'message': "Error: FFmpeg not found. Please install FFmpeg."}))
        return None

    except Exception as e:
        # Catch-all for any other exceptions
        print(json.dumps(
            {'message': f"An error occurred during conversion: {str(e)}"}))
        return None


# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Check if the input is a file or a stream
input_source = sys.argv[1]
input_metadata = sys.argv[2]
# read the metadata from the input source
print(json.dumps(
    {'message': f'Processing input: {input_source}', 'metadata': input_metadata,
        'progress': 1,
        'message': 'Processing input...'
     }))


def correlate_video_and_location_to_dict(frames, locations):
    frame_idx, location_idx = 0, 0
    correlated_data = {}

    while frame_idx < len(frames) and location_idx < len(locations):
        frame_time = frames[frame_idx]["timestamp"]
        location_time = locations[location_idx]["timestamp"]

        # Move location pointer to find the nearest timestamp
        if location_idx < len(locations) - 1:
            next_location_time = locations[location_idx + 1]["timestamp"]
            if abs(next_location_time - frame_time) < abs(location_time - frame_time):
                location_idx += 1
                continue

        # Correlate the frame with the current location
        correlated_data[frames[frame_idx]["frameId"]] = {
            "frame_timestamp": frame_time,
            "location": locations[location_idx],
        }

        # Move to the next frame
        frame_idx += 1

    return correlated_data


with open(input_metadata, 'r') as f:
    meta_data = json.load(f)

print(json.dumps({'message': 'Metadata loaded successfully.',
                  'progress': 2,
                  'message': 'Metadata loaded successfully.'
                  }))

print(json.dumps({'message': 'Processing metadata...',
                  'progress': 3,
                  'message': 'Processing metadata...'
                  }))

frames = sorted(meta_data['frames'], key=lambda x: x["timestamp"])
locations = sorted(meta_data['locations'], key=lambda x: x["timestamp"])

frames = sorted(meta_data['frames'], key=lambda x: x["frameId"])


processed_metadata = correlate_video_and_location_to_dict(
    frames, locations)

print(json.dumps({'message': 'Metadata processed successfully.',
                  'progress': 100,
                  'message': 'Metadata processed successfully.'
                  }))
print(json.dumps({'message': 'Processing video...',
                  'progress': 4,
                  'message': 'Processing video...'
                  }))


is_live_stream = input_source.lower() == 'live'


ext = get_format_by_extension(input_source)

if ext == 'webm':
    # Convert WebM to MP4
    mp4_output = convert_webm_to_mp4(
        input_source, input_source.replace('.webm', '.mp4'))
    if mp4_output:
        input_source = mp4_output
    else:
        error_message = {
            'progress': 100,
            'message': 'Error converting WebM to MP4. Please check the input file.'
        }
        print(json.dumps(error_message))
        sys.exit(1)

output_dir = 'videos'
os.makedirs(output_dir, exist_ok=True)

output_imges_dir = 'videos/images'
os.makedirs(output_imges_dir, exist_ok=True)


# Initialize YOLO model as a singleton
model_path = 'models/best.onnx'
data_yaml = 'models/data.yaml'

try:
    yolo_model = YOLO_Pred(model_path, data_yaml, use_cuda=True)
except Exception as e:
    error_message = {
        'progress': 100,
        'message': f'Error initializing YOLO model: {str(e)}'
    }
    logging.error(error_message['message'])
    print(json.dumps(error_message))
    sys.exit(1)

# Video source: live stream or uploaded video
cap = cv2.VideoCapture(0) if is_live_stream else cv2.VideoCapture(input_source)

if not cap.isOpened():
    error_message = {
        'progress': 100,
        'message': 'Error: Unable to open video source. Please check the input.'
    }
    logging.error(error_message['message'])
    print(json.dumps(error_message))
    sys.exit(1)

# fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fourcc = cv2.VideoWriter_fourcc(*'avc1')


# Get video properties (use defaults for live streams)
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS)) if not is_live_stream else 30
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)
                  ) if not is_live_stream else -1

# Output video path
file_extension = os.path.splitext(input_source)[1]
output_video_path = os.path.join(output_dir, os.path.basename(
    input_source).replace(file_extension, f'-output{file_extension}'))
out = cv2.VideoWriter(output_video_path, fourcc, fps,
                      (frame_width, frame_height))

output_imges_dir = os.path.join(
    output_imges_dir, os.path.basename(input_source).replace(file_extension, ''))

os.makedirs(output_imges_dir, exist_ok=True)

frame_num = 0
frame_idx1 = frames[0]["frameId"]
frame_idx_last = frames[-1]["frameId"]

print(json.dumps({"last_frame": frame_idx_last}))
last_reported_progress = 0
detected_objects = []
images = []
prev_frame = None

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            if not is_live_stream:  # For files, stop when frames are exhausted
                break
            continue  # For live streams, continue reading

        # Process the frame using YOLO model
        # processed_frame, objects = yolo_model.predictions_with_objects(frame)
        processed_frame, objects = yolo_model.predictions_with_tracking(frame)
        # check if the objects are not empty
        
        
        
        if objects:
            
            for obj in objects:

                # check the metadata for frame idx

                if frame_idx1 in processed_metadata:
                    x = processed_metadata[frame_idx1]["location"]["latitude"]
                    y = processed_metadata[frame_idx1]["location"]["longitude"]

                img_name = f'{obj["label"]}_{str(x)}_{str(y)}.jpg'
                img_path = os.path.join(
                        output_imges_dir,img_name)
                if img_path not in images:
                    images.append(img_path)
                else:
                    # save the image
                    if prev_frame is not None:
                        cv2.imwrite(img_path, prev_frame)
                    else:
                        cv2.imwrite(img_path, frame)

                detected_objects.append({
                    "track_id": obj['track_id'],
                    'label': obj['label'],
                    "width": obj['width'],
                    "height": obj['height'],
                    "x": x,
                    "y": y,
                    "image_path": img_path
                })
                

        if processed_frame is None:
            error_message = {
                'progress': 100,
                'message': f'Error processing frame {frame_num}. Skipping.'
            }
            logging.warning(error_message['message'])
            print(json.dumps(error_message))
            continue

        # Write the processed frame to the output video
        out.write(processed_frame)

        # Update progress (only for uploaded videos)
        if not is_live_stream and frame_count > 0:
            frame_num += 1
            frame_idx1 += 1
            progress = int((frame_num / frame_count) * 100)
            if progress - last_reported_progress >= 11:
                progress_update = {
                    # "detectedObjects": detected_objects,
                    'progress': progress,
                    'message': f'Processing frame {frame_num}/{frame_count}'
                }

                if progress > 89:
                    progress_update = {
                        'detectedObjects': deduplicate_objects(detected_objects),
                        'progress': progress,
                        'message': f'Processing frame {frame_num}/{frame_count}'
                    }

                print(json.dumps(progress_update))
                last_reported_progress = progress

        prev_frame = processed_frame.copy()

except Exception as e:
    error_message = {
        'progress': 100,
        'message': f'An error occurred during processing: {str(e)}'
    }
    logging.error(error_message['message'])
    print(json.dumps(error_message))
finally:
    cap.release()
    out.release()
d_detected_objects = []
if detected_objects:
    d_detected_objects = deduplicate_objects(detected_objects)

# cleanup_images(d_detected_objects, output_imges_dir)

kms = total_distance_km(locations)
output_video_info = {
    'output_video': output_video_path,
    'detected_objects': d_detected_objects,
    "total_distance_km": kms,
    "progress": 100,
    "message": "Processing completed successfully."
}


# Send the final output video path to the backend
print(json.dumps(output_video_info))
sys.exit(0)
