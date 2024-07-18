# Registry_API
Registry backend created using Nodejs and Express. (My first node.js app)
For api documentation swagger was used.(Mostly copied from tutorials and template for endpoint docs was ai generated)

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
docker run -p <desired_localhost_port>:3000 <the_built_images_tag>
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

### /api-docs
- For more detailed endpoint documentation (swagger)
- Can be opened in browser!
