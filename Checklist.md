## **High-Level GitFlow Overview**

1. **`main` (Production)**  
   - Always contains the **production-ready** code.  
   - When a feature set is complete and tested, merges (from `release/x.x.x`) go into `main`.  
   - **Hotfix branches** come off of `main`.

2. **`develop` (Latest Development)**  
   - The working integration branch where multiple features come together for testing.  
   - **Feature branches** merge here frequently.  
   - Once `develop` is stable and ready for a release, we create a **`release/x.x.x`** branch from `develop`.

3. **`feature/*` (Active Development)**  
   - Short-lived branches named for the feature or task (e.g., `feature/core`, `feature/streaming`, etc.).  
   - Merged back into `develop` when feature is complete (and tested).

4. **`release/x.x.x` (Release Stabilization)**  
   - Created off of `develop` when we decide to freeze features and prepare for a release.  
   - Merge into both `main` (to deploy) and back into `develop` (to catch any last-minute fixes).

5. **`hotfix/*` (Emergency Fixes)**  
   - Branch off of `main` to quickly patch production issues.  
   - Merged back to both `main` (to fix production) and `develop` (so the fix isn’t lost).

---

## **Branch Naming in This Project**

- **`main`**: Final, production code (stable).  
- **`develop`**: Consolidated development and testing code.  
- **`feature/core`**: Person A’s main feature branch.  
- **`feature/streaming`**: Person B’s main feature branch.  
- **`release/1.0.0`**, `release/1.1.0`, etc.: Release branches.  
- **`hotfix/issue-123`**: Example hotfix branch off `main` to fix a critical bug.

---

## **Overall Project Milestones**

We’ll keep the same **4 Milestones** as before, but integrate them into GitFlow:

1. **Milestone 1**: Repository Setup & Basic Project Configuration  
2. **Milestone 2**: Independent Feature Development  
3. **Milestone 3**: Integration & Documentation  
4. **Milestone 4**: Testing, Polishing & Release

Below is how each milestone aligns with the GitFlow steps.

---

## **Milestone 1: Repository Setup & Basic Project Configuration**

> **Goal**: Prepare the project structure, initial commits, and ensure everyone can build/test locally.

### **GitFlow Steps for Milestone 1**

1. **Create Repo & `main`**  
   - Initialize the repository with `main` as the default branch on GitHub/GitLab.

2. **Create `develop`**  
   - From `main`, create a `develop` branch:  
     ```
     git checkout main
     git checkout -b develop
     git push origin develop
     ```

3. **Create Feature Branches**  
   - Person A: `git checkout -b feature/core develop`  
   - Person B: `git checkout -b feature/streaming develop`

### **Tasks & Checklists**

1. **Shared Setup Tasks**  
   - [ ] **Initialize NPM/Node**: `npm init -y`  
   - [ ] **Add Dependencies**: e.g., `axios`, `eslint`, `jest`, etc.  
   - [ ] **Project Folder Structure**:  
     ```
     ollama-api-wrapper/
       ├── docs/
       ├── src/
       ├── tests/
       ├── package.json
       ├── .gitignore
       └── README.md
     ```

2. **Local Environment Verification**  
   - **Person A** on `feature/core`:  
     - [ ] Install deps (`npm install`), run lint/tests.  
     - [ ] Commit the basic structure.  
     - [ ] Push to origin: `feature/core`.  
   - **Person B** on `feature/streaming`:  
     - [ ] Same local setup check.  
     - [ ] Commit any initial skeleton changes.  
     - [ ] Push to origin: `feature/streaming`.

3. **Merge Both Feature Branches into `develop`**  
   - Once both have a stable starting point (just the skeleton), open PRs into `develop`.  
   - [ ] **Person A**: PR `feature/core` → `develop`.  
   - [ ] **Person B**: PR `feature/streaming` → `develop`.  
   - Approve & merge them. Now `develop` has the initial structure from both sides.  
   - **Stop**: This is the end of Milestone 1. 

> At this point:
> - `main` is still basically empty or minimal.  
> - `develop` is the main dev branch with the initial project setup.

---

## **Milestone 2: Independent Feature Development**

> **Goal**: Build out the separate components in parallel, each in a **feature branch**.

### **GitFlow Steps for Milestone 2**

1. **Update Your Feature Branches**  
   - After Milestone 1 merges into `develop`, each person can pull the latest `develop` changes into their feature branch.  
   - **Example**:  
     ```
     git checkout feature/core
     git pull origin develop
     ```
   - This ensures both Person A and Person B have the same baseline.

2. **Implement & Commit**  
   - Person A works in `feature/core`, Person B in `feature/streaming`.
   - Commit frequently, push often.

3. **Open/Review Pull Requests** (Iterative)  
   - Each person can do multiple merges from `feature/<branch>` to `develop` once they finish a chunk of work.

### **Specific Tasks**

#### **Person A: Core Library Development**
1. **Core Functions**  
   - [ ] `generateCompletion(text, config)`  
   - [ ] `chat(messages, config)`  
   - [ ] `createModel(modelConfig)`  
   - [ ] `listModels()`  
   - [ ] `showModelInfo(modelName)`  
2. **Configuration & Error Handling**  
   - [ ] Support for `host`, `port`, etc.  
   - [ ] Return meaningful error messages.  
3. **Unit Tests**  
   - [ ] Write and pass all unit tests in `tests/core.test.js`.

#### **Person B: Streaming & Structured Output**
1. **Streaming Functionality**  
   - [ ] `streamChat(messages, config)` for token-by-token streaming.  
2. **Structured Output Parsing**  
   - [ ] Implement logic if Ollama returns JSON or specialized data.  
3. **Error Handling & Unit Tests**  
   - [ ] Incomplete stream handling, test coverage in `tests/streaming.test.js`.

### **Milestone 2 Completion Criteria**
- [ ] **Person A** merges `feature/core` → `develop` (once core features are done & tests pass).  
- [ ] **Person B** merges `feature/streaming` → `develop` (once streaming features are done & tests pass).  
- [ ] `develop` now contains both modules (core + streaming).

At this point, we have a more complete library on `develop`. **`main`** is still untouched because we haven’t released yet.

---

## **Milestone 3: Integration & Documentation**

> **Goal**: Combine modules cohesively and unify docs. Typically done on `develop`.

### **GitFlow Steps for Milestone 3**

1. **Create a (Possible) Integration Feature Branch**  
   - Optionally, create a `feature/integration` from `develop` to do final integration tasks.  
   - Or do them directly on `develop` (if simpler).

2. **Integration Testing**  
   - [ ] Write `tests/integration.test.js` that calls both core and streaming functionality end-to-end.

3. **Consolidate Documentation**  
   - [ ] Merge `docs/core-usage.md` and `docs/streaming-usage.md` into a single `docs/README.md` or the main `README.md`.  
   - [ ] Create `examples/` folder with scripts demonstrating basic usage.

4. **Merge Integration/Docs Work into `develop`**  
   - Once the integration tests and docs are done, merge the `feature/integration` (if used) into `develop`.

### **Milestone 3 Completion Criteria**
- [ ] `develop` has a fully integrated codebase with up-to-date docs.  
- [ ] All integration tests pass.

---

## **Milestone 4: Testing, Polishing & Release**

> **Goal**: Final QA, create a release branch from `develop`, then push to `main`.

### **GitFlow Steps for Milestone 4**

1. **Create a Release Branch**  
   - From `develop`:  
     ```
     git checkout develop
     git checkout -b release/1.0.0
     git push origin release/1.0.0
     ```
   - This branch is now for final tweaks, version bump, and preparing for a stable release.

2. **Polish & Test**  
   - [ ] Additional QA, load testing, or code review.  
   - [ ] Bump version in `package.json` to `1.0.0`.  
   - [ ] Document any known issues or future enhancements.

3. **Merge Release Branch into `main`**  
   - Final “release” commit merges into `main`:  
     ```
     git checkout main
     git merge --no-ff release/1.0.0
     ```
   - Tag it: `git tag -a v1.0.0 -m "Release 1.0.0" && git push --tags`.  
   - Also merge changes back into `develop` (to ensure no release fixes are lost):  
     ```
     git checkout develop
     git merge --no-ff release/1.0.0
     ```
   - `release/1.0.0` branch can be deleted once merged.

4. **Publish**  
   - [ ] `npm publish` (if public).  
   - [ ] Now `main` is the official version 1.0.0.

### **Milestone 4 Completion Criteria**
- [ ] Released version in `main`.  
- [ ] Tag created (e.g., `v1.0.0`).  
- [ ] Code merged back to `develop`.

---

## **Hotfix Workflow**

Should a critical bug be found **after** merging to `main`, you would:

1. **Branch Off `main`**: `hotfix/fix-urgent-bug`  
2. **Fix & Commit**  
3. **Merge hotfix** back to `main` (to deploy the fix) **and** to `develop` (so the fix is in the latest dev code).  
4. **Tag** the new version if necessary.

This ensures the quick fix goes to production **without** waiting on the entire development cycle.

---

## **Final Consolidated Checklist**

Here’s a concise version of the entire flow with the Git branching logic baked in:

1. **Milestone 1**  
   - **`main`** created → **`develop`** created → Each developer starts a **`feature/*`** branch.  
   - [ ] Basic skeleton, NPM init, lint/test config done.  
   - [ ] Merge feature branches back into `develop` once stable (just setup code).

2. **Milestone 2**  
   - **Active development** on **`feature/core`** (Person A) & **`feature/streaming`** (Person B).  
   - [ ] Each merges repeatedly into `develop` (PR -> code review -> merge).  
   - [ ] End result: `develop` has all new features combined.

3. **Milestone 3**  
   - Possibly a **`feature/integration`** from `develop`.  
   - [ ] Integration tests, doc consolidation, examples.  
   - [ ] Merge final integrated code back to `develop`.

4. **Milestone 4**  
   - Create **`release/x.x.x`** from `develop`.  
   - [ ] Final polish, version bump.  
   - [ ] Merge `release/x.x.x` → `main`, then back → `develop`.  
   - [ ] Tag & publish.  

5. **Hotfix**  
   - If needed, **`hotfix/*`** from `main`.  
   - Merge back to `main` + `develop`.

This workflow ensures:

- **`main`** always reflects production-ready releases.  
- **`develop`** is the up-to-date testing/integration environment.  
- **`feature/*`** branches isolate new work, preventing conflict.  
- **`release/*`** branches give you stable snapshots before final deployment.  
- **`hotfix/*`** patches production quickly and merges changes back into `develop`.
