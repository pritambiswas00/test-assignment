# Approach and Design Choices

## Goal
Set up a reliable way to run the `web` app from a PNPM/Turbo monorepo both locally and with Docker Compose, while keeping the image build reproducible and efficient.

## Approach
- Used a monorepo-aware Docker build with repository root as context.
- Built only the `web` app dependency graph instead of the whole workspace runtime.
- Kept Docker stages separated (prune/install/build/run) to reduce final image size and improve cache behavior.

## Folder Structure and Why It Was Chosen

### High-level Layout
- `apps/web`: the deployable Next.js application (UI routes, app-specific components, app-level providers).
- `packages/*`: reusable libraries shared across apps (`ui`, `utils`, `http-client`, `local-storage`, config packages).
- root config (`turbo.json`, `pnpm-workspace.yaml`, shared ts/eslint configs): workspace-level orchestration and standards.

### Why This Structure
- **Separation of concerns**: app delivery logic stays in `apps/`, reusable domain/infrastructure logic stays in `packages/`.
- **Reuse by design**: shared packages can be consumed by current and future apps without copy-paste.
- **Independent testing**: each package can have focused unit tests and clear ownership boundaries.
- **Safer changes**: typed package APIs reduce accidental cross-layer coupling and make refactors easier.
- **Scalable monorepo ops**: Turbo can cache and run only affected packages/apps, improving CI and local iteration.

### Layering Inside `apps/web`
- `app/`: route-level composition and page orchestration.
- `components/`: feature UI modules (cart/products), kept close to app needs.
- `lib/`: integration boundary (HTTP client wrappers, API adapters, formatting helpers).
- `providers/`: global wiring (theme/context providers).
- `env.ts`: typed environment contract at app boundary.

### Layering Inside `packages`
- `utils`: functional primitives (`Result`, `Option`) used as shared control-flow contracts.
- `http-client`: transport abstraction returning typed `HttpResult` values.
- `local-storage`: persistence abstraction with typed error/result channels.
- `ui`: shared design-system components to keep visual consistency across apps.

### Architectural Outcome
- Data flow becomes explicit and composable from infrastructure (`packages`) to presentation (`apps/web`).
- Error and success channels remain strongly typed across boundaries.
- The structure supports growth (more apps/services) without collapsing into a tightly coupled codebase.

## Key Design Choices

### 0) Functional Error Handling and Composition
- The codebase uses a functional style with `Result` and `Option` primitives to model outcomes explicitly.
- This gives two clean channels in data flow:
	- **Data channel**: successful values (`Result.ok(...)`, `Option.some(...)`)
	- **Error channel**: domain/infrastructure failures (`Result.err(...)`, `Option.none()`)
- Instead of throwing exceptions through the call stack, functions return typed outcomes and compose them with `match`, `map`, and `flatMap`-style transformations.
- This keeps control flow predictable and makes error handling explicit at each boundary (HTTP layer, parsing layer, and UI rendering layer).

### 0.1) Monoid-Oriented Thinking
- Error handling follows monoidal principles conceptually: we preserve associativity in composition and keep an identity-like neutral success path.
- In practice, each step either propagates an existing error unchanged or enriches context (endpoint, status, reason), which makes failures composable and traceable.
- This approach avoids mixing partial data and failures in the same object, resulting in a more elegant and testable pipeline.

### 0.2) Elegant Separation of Concerns
- Transport concerns (HTTP status, request failures) are converted into typed domain errors early.
- Validation concerns (schema parsing) are handled in a dedicated stage and mapped to typed `invalid_payload` errors.
- UI concerns consume only the final `Result`, rendering success views from the data channel and fallback/not-found states from the error channel.
- The result is a clean composition chain where each layer has a single responsibility and explicit contracts.

### 1) Build-time vs Runtime Environment Variables
- `EXTERNAL_SERVER_API` is validated during Next.js build, not only at container runtime.
- Because of this, env values are passed through `docker-compose.yml` using `build.args` and then wired in the Dockerfile builder stage.
- Runtime `environment` is still kept for consistency and observability.

### 2) Next.js Standalone Output
- Enabled standalone output in Next config so the runner image can copy and execute the minimal server bundle.
- This avoids shipping full source and unnecessary build tooling in the runtime image.

### 3) Monorepo Efficiency
- Used Turbo prune pattern in Docker flow so install/build operate on reduced project scope.
- This improves layer caching and lowers install/build overhead in CI and local container builds.

### 4) Stability Fixes
- Removed assumptions about optional folders (for example, missing `public`) to prevent Docker COPY failures.
- Kept configuration explicit in compose for predictable behavior across machines.

## Trade-offs
- Multi-stage Dockerfiles are more complex than single-stage images.
- Passing values in both build args and runtime env is slightly redundant, but prevents build-time validation failures and keeps runtime config explicit.

## Outcome
- Docker Compose build succeeds for the monorepo web app.
- Required environment variables are available at the correct lifecycle phase.
- README now includes practical install/run instructions for local and containerized workflows.
