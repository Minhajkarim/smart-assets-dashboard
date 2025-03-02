from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import connected_components
from scipy.spatial.distance import pdist, squareform
import numpy as np
import pandas as pd
import json
import os


def haversine(lat1, lon1, lat2, lon2):
    """Compute the Haversine distance (in meters) between two lat/lon points."""
    R = 6371000  # Earth radius in meters
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    delta_phi = np.radians(lat2 - lat1)
    delta_lambda = np.radians(lon2 - lon1)

    a = np.sin(delta_phi / 2.0)**2 + np.cos(phi1) * \
        np.cos(phi2) * np.sin(delta_lambda / 2.0)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))

    return R * c  # Distance in meters


def deduplicate(objects):

    print(json.dumps({"Process": "Deduplication"}))
    # Load data into a DataFrame
    df = pd.DataFrame(objects, columns=['x', 'y', 'label', 'width', 'height'])

    # Remove exact duplicates (if any)
    df = df.drop_duplicates(subset=['x', 'y', 'label'], keep='first')

    # Set the deduplication threshold (in meters)
    DISTANCE_THRESHOLD_METERS = 15  # Adjust based on dataset distances

    # Initialize object counter
    global_object_id = 0

    # Final list to store deduplicated objects
    deduplicated_objects = []

    # Process each label separately
    for label in df['label'].unique():
        subset = df[df['label'] == label].copy()

        if len(subset) == 0:
            continue  # Skip empty groups

        # Extract lat/lon coordinates
        coords = subset[['x', 'y']].values

        # Compute pairwise Haversine distance matrix
        distance_matrix = squareform(
            pdist(coords, lambda u, v: haversine(u[0], u[1], v[0], v[1])))

        # Convert to sparse adjacency matrix
        adjacency_matrix = csr_matrix(
            distance_matrix < DISTANCE_THRESHOLD_METERS)

        # Compute connected components (clusters of nearby objects)
        num_components, labels = connected_components(
            csgraph=adjacency_matrix, directed=False)

        # Assign object IDs, ensuring uniqueness across all labels
        subset['object_number'] = labels + global_object_id

        subset = subset.drop_duplicates(subset=["object_number"])

        # Update global counter to avoid object number conflicts between labels
        global_object_id += num_components

        # Append results
        deduplicated_objects.append(subset)

    # Combine all deduplicated data
    df_deduplicated = pd.concat(deduplicated_objects, ignore_index=True)

    df_deduplicated = df_deduplicated.drop_duplicates(subset=["object_number"])

    # Convert to dictionary list and return
    return df_deduplicated.to_dict(orient='records')


def deduplicate_objects(objects):
    seen = set()
    deduplicated = []
    for obj in objects:
        if obj['track_id'] not in seen:
            deduplicated.append(obj)
            seen.add(obj['track_id'])

    print(json.dumps(
        {"Process": f"Deduplication: {len(objects)} -> {len(deduplicated)}"}))
    return deduplicated



def total_distance_km(locations):
    total_km = 0.0
    for i in range(1, len(locations)):
        lat1 = locations[i-1]['latitude']
        lon1 = locations[i-1]['longitude']
        lat2 = locations[i]['latitude']
        lon2 = locations[i]['longitude']
        total_km += haversine(lat1, lon1, lat2, lon2)
    return total_km / 1000.0

def cleanup_images(objects, img_dir_path):
    img_paths = []
    
    for obj in objects:
        img_paths.append(f"img_dir_path/{obj['image_path']}")

    # delete all imgages in img_dir_path that are not in img_paths
    import os
    for filename in os.listdir(img_dir_path):
        if filename not in img_paths:
            # os.remove(os.path.join(img_dir_path, filename))
            pass
