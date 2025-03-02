from postProcess import total_distance_km
import json

with open('/home/azurenvidia/smart-assets-webapp/smart-assets-backend/uploads/video-1be39049-a936-49bf-876f-f1bed9365ae1-PGe5lGF5OVfkz9ZAAAG5.json') as f:
    data = json.load(f)


print(total_distance_km(data['locations']))