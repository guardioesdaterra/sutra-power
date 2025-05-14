# Uploads Directory

This directory is used for storing user-uploaded files like 3D models.

## Directory Structure

- `/uploads/models/` - For 3D model files (.glb, .gltf)

## Usage Notes

1. For the demo version of this application, you'll need to manually add files to these directories
2. In a production environment, this would be handled by proper server-side upload handlers
3. Default models are available in the `/assets/` directory:
   - `/assets/astronaut.glb` - Default astronaut model
   - `/assets/duck.glb` - Duck model

## Models

When uploading models in the application:

1. The application will reference them using paths like `/uploads/models/yourmodel.glb`
2. These files need to exist in the corresponding directories
3. If a model file is missing, the app will try to fallback to `/assets/astronaut.glb`

## Troubleshooting

If you see errors like:
```
GET http://yoursite/uploads/models/modelname.glb 404 (Not Found)
```

Make sure you've placed the model file in the correct location: `public/uploads/models/modelname.glb` 