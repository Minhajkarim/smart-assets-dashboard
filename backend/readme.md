# Smart Assets Dashboard – Backend

This backend powers the **Smart Assets Dashboard**, providing:

- A **Node.js** server for APIs, routing, and integration with frontend.
- **Python** scripts for advanced video processing or analytics.
- **FFmpeg** (custom build) with a broad range of codecs and libraries.
- **OpenCV** (custom build) with CUDA, cuDNN, and FFmpeg support.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
   - [Node.js Dependencies](#1-install-nodejs-dependencies)
   - [Python Dependencies](#2-install-python-dependencies)
   - [FFmpeg Installation (With Custom Flags)](#3-ffmpeg-installation-with-custom-flags)
   - [OpenCV Installation (With GPU and FFmpeg)](#4-opencv-installation-with-gpu-and-ffmpeg)
3. [Setup](#setup)
   - [Environment Variables](#environment-variables)
   - [Starting the Server](#starting-the-server)
   - [Python Integration](#python-integration)

---

## Overview

The backend is organized as follows:

- **server.js**: Entry point for the Node.js server.
- **routes/**, **controllers/**, **models/**: Handle API endpoints, business logic, and data structures.
- **Python scripts** (e.g., `processRecording.py`, `YOLO_Pred.py`): Perform CPU/GPU-intensive tasks like object detection, video transcoding, etc.
- **Uploads/Videos directories**: Where media is stored and processed.

A **GPU-enabled** build of OpenCV (with FFmpeg) and a **feature-rich** FFmpeg installation are required to leverage advanced video handling.

---

## Installation

### 1. Install Node.js Dependencies

1. Make sure you have **Node.js** (v14+ recommended) and **npm** or **yarn** installed.
2. From your project’s `backend` directory, run:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```
3. This installs all Node.js packages needed (e.g., Express, Mongoose, etc., depending on your `package.json`).

### 2. Install Python Dependencies

1. Verify **Python 3** is installed:
   ```bash
   python --version
   ```
2. If you have a `requirements.txt`, install everything at once:
   ```bash
   pip install -r requirements.txt
   ```
3. Otherwise, install needed libraries (e.g., `numpy`, `torch`, `opencv-python`—though in this case you’ll be using a custom OpenCV build) individually:
   ```bash
   pip install numpy torch
   # etc.
   ```

### 3. FFmpeg Installation (With Custom Flags)

**FFmpeg** must be built or installed with a wide range of codecs and libraries. Below is how to replicate the build found in your environment.

#### A. Install Build Dependencies

On Ubuntu/Debian, for example:

```bash
sudo apt-get update
sudo apt-get install -y \
    autoconf automake build-essential libtool pkg-config yasm \
    libass-dev libfreetype6-dev libgnutls28-dev libmp3lame-dev \
    libopus-dev libtheora-dev libvorbis-dev libvpx-dev libwebp-dev \
    libx264-dev libx265-dev libnuma-dev libaom-dev libdav1d-dev \
    libopenjpeg-dev libopenmpt-dev libpulse-dev librabbitmq-dev \
    librubberband-dev libshine-dev libsnappy-dev libsoxr-dev \
    libspeex-dev libsrt-dev libssh-dev libtwolame-dev libvidstab-dev \
    libxml2-dev libxvidcore-dev libzimg-dev libzmq3-dev libzvbi-dev \
    liblv2core-dev opencl-dev openal-dev libgtk-3-dev libdrm-dev \
    frei0r-plugins-dev chromaprint-dev pocketsphinx-dev \
    ladspa-sdk libbs2b-dev libfribidi-dev libfontconfig1-dev \
    libgme-dev libdc1394-22-dev libiec61883-dev
```

_(Adjust packages as needed for your distro.)_

#### B. Download FFmpeg Source

```bash
git clone https://git.ffmpeg.org/ffmpeg.git ffmpeg
cd ffmpeg
```

_(Or grab a tarball from [FFmpeg’s official site](https://ffmpeg.org/download.html))._

#### C. Configure With Desired Flags

Use the configure flags that match your current build:

```bash
./configure \
  --prefix=/usr \
  --extra-version=0ubuntu0.22.04.1 \
  --toolchain=hardened \
  --libdir=/usr/lib/x86_64-linux-gnu \
  --incdir=/usr/include/x86_64-linux-gnu \
  --arch=amd64 \
  --enable-gpl \
  --disable-stripping \
  --enable-gnutls \
  --enable-ladspa \
  --enable-libaom \
  --enable-libass \
  --enable-libbluray \
  --enable-libbs2b \
  --enable-libcaca \
  --enable-libcdio \
  --enable-libcodec2 \
  --enable-libdav1d \
  --enable-libflite \
  --enable-libfontconfig \
  --enable-libfreetype \
  --enable-libfribidi \
  --enable-libgme \
  --enable-libgsm \
  --enable-libjack \
  --enable-libmp3lame \
  --enable-libmysofa \
  --enable-libopenjpeg \
  --enable-libopenmpt \
  --enable-libopus \
  --enable-libpulse \
  --enable-librabbitmq \
  --enable-librubberband \
  --enable-libshine \
  --enable-libsnappy \
  --enable-libsoxr \
  --enable-libspeex \
  --enable-libsrt \
  --enable-libssh \
  --enable-libtheora \
  --enable-libtwolame \
  --enable-libvidstab \
  --enable-libvorbis \
  --enable-libvpx \
  --enable-libwebp \
  --enable-libx265 \
  --enable-libxml2 \
  --enable-libxvid \
  --enable-libzimg \
  --enable-libzmq \
  --enable-libzvbi \
  --enable-lv2 \
  --enable-omx \
  --enable-openal \
  --enable-opencl \
  --enable-opengl \
  --enable-sdl2 \
  --enable-pocketsphinx \
  --enable-librsvg \
  --enable-libmfx \
  --enable-libdc1394 \
  --enable-libdrm \
  --enable-libiec61883 \
  --enable-chromaprint \
  --enable-frei0r \
  --enable-libx264 \
  --enable-shared
```

#### D. Compile and Install

```bash
make -j$(nproc)
sudo make install
```

#### E. Verify

```bash
ffmpeg -buildconf
```

You should see the same flags listed above.

### 4. OpenCV Installation (With GPU and FFmpeg)

To take advantage of GPU-accelerated video processing, **OpenCV** must be built from source with CUDA, cuDNN, and FFmpeg enabled.

#### A. Download OpenCV and Contrib

```bash
git clone https://github.com/opencv/opencv.git
git clone https://github.com/opencv/opencv_contrib.git
```

#### B. Configure With CMake

Below is an **example** consistent with your environment:

```bash
cd opencv
mkdir build && cd build

cmake -D CMAKE_BUILD_TYPE=Release \
      -D CMAKE_INSTALL_PREFIX=/usr/local \
      -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules \
      -D WITH_CUDA=ON \
      -D WITH_CUDNN=ON \
      -D WITH_FFMPEG=ON \
      -D BUILD_opencv_python3=ON \
      -D BUILD_opencv_world=OFF \
      -D ENABLE_FAST_MATH=ON \
      -D CUDA_FAST_MATH=ON \
      -D WITH_GSTREAMER=ON \
      ..
make -j$(nproc)
sudo make install
```

_(Adjust `CUDA_ARCH_BIN` or other flags as needed for your GPU.)_

#### C. Verify Your OpenCV Build

```bash
python -c "import cv2; print(cv2.getBuildInformation())"
```

Look for **CUDA** and **FFmpeg** set to **YES**. Also confirm **cuDNN** versions, GPU architectures, etc.

---

## Setup

### Environment Variables

Create a file named `.env` (if not present) in the `backend/` folder and populate it with settings relevant to your application:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-assets
JWT_SECRET=your_secret_key
```

Adjust as needed for your environment.

### Starting the Server

From the `backend` directory, run:

```bash
npm start
```

(or `yarn start`)

By default, the server listens on `http://localhost:3000`. Update `PORT` in `.env` to change this.

### Python Integration

The Node.js server calls Python scripts (e.g., `postProcess.py`, `processRecording.py`) for tasks like:

- Object detection with YOLO.
- Video conversion or analysis with OpenCV + FFmpeg.

Make sure:

- `python` is accessible in your PATH (or specify the exact path in your Node code).
- Your custom-built OpenCV and FFmpeg installations are recognized.
- Any additional Python dependencies (e.g., `numpy`, `torch`, `Pillow`) are installed.

---

**That’s it!** You now have:

1. **Node.js** and required packages installed.
2. **Python 3** with necessary libraries.
3. **FFmpeg** built from source with all relevant codecs and libraries.
4. **OpenCV** built with GPU acceleration and FFmpeg support.

You’re ready to run the **Smart Assets Dashboard** backend for advanced video processing and analytics.
