# Frontend Docker Delivery Tasks

These tasks capture the containerization work for the Next.js frontend so deployments can set the backend origin through environment variables.

1. **Create production Docker image**
   - Add a multi-stage Dockerfile that installs pnpm dependencies, builds the Next.js app, and ships a lean runtime image exposing port 3000.
   - Pass `BACKEND_ORIGIN` into `NEXT_PUBLIC_API_BASE_URL` and `API_BASE_URL` during build and runtime to avoid hard-coded hosts.

2. **Harden Docker build context**
   - Add a `.dockerignore` in the `frontend` directory to exclude `node_modules`, `.next`, VCS metadata, and local caches from the context.
   - Keep only the files required for reproducible builds and runtime execution.

3. **Document container usage**
   - Extend the frontend README with Docker build/run commands and environment variable guidance.
   - Note that the backend origin is configured via `BACKEND_ORIGIN` for both build and runtime.

4. **Validate image locally**
   - Build the image with `docker build -t larago-frontend frontend` and run it with `docker run -p 3000:3000 -e BACKEND_ORIGIN=<your-backend> larago-frontend`.
   - Confirm the container serves the landing and login pages while proxying API requests to the configured backend.
