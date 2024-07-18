# Registry_API
Registry backend created using Python and flask.
For api documentation swagger was used.

## Prerequisites
Only prerequisite is Docker installation.
For Docker installation follow the offical Docker documentation: https://docs.docker.com/engine/install/

## Running the application

Navigate into the root of the cloned repository and build the docker image.

```
docker build -t <prefered_tag> .
```
<br>

After successfully building the image spin up the container.

```
docker run -p <desired_localhost_port>:8000 <the_built_images_tag>
```

Application will be available on the choosen port --> localhost:<choosen_port>
<br>


## Endpoints

### /add
    - For adding items into registry

### /remove/<item>
- For removing items from registry

### /check/<item>
- For checking if an item is in the registry

### /invert
- For inverting the registry

### /diff
- For getting the difference between a provided set and our current set

### /apidocs
- For more detailed endpoint documentation (swagger)

## Testing

Couple Unit Tests were created. To run them set TEST environment variable true when starting docker container.
```
docker run -e TEST=true <the_built_images_tag>
```

## Used libraries

- For the API basic Flask application was created using only CRUD methods.
- Application is run by gunicorn wsgi application server

--> Used libraries can be found in requirements.txt

### Node.js solution was also created and is available on the Node_registry branch.