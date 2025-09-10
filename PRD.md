FlowBoard


1. Problem Statement

To empower our engineers to think deeply about state management, design trade-offs, and AI-native development practices, we are launching a focused assignment to build a lightweight Kanban board application, codenamed FlowBoard.

The vision is to create a simple task management tool that mimics the core interactions of Trello but with reduced scope, focusing on component design, drag-drop interactions, and iterative AI-assisted development.

Please note: For the assignment, please use localStorage as the persistence layer, no API integration is required.


2. Core Functional Requirements


· Columns: The board must have three fixed columns – To Do, In Progress, Done.

· Add Task: Users must be able to add a task (title only) to the To Do column.

· Move Task: Tasks can be moved across columns (via drag-drop OR buttons).

· Delete Task: Users can delete a task from any column.

· Task State: Tasks must be stored in component state.

· Drag-and-Drop: Implement native drag-drop using browser events (mousedown, mousemove, etc.). Libraries like react-dnd are prohibited.

· Persistence: Tasks must persist in localStorage.

· Filtering (Optional): Provide a simple filter (e.g., show only "In Progress").

· Architecture Trade-offs: Document state management choice (Context API, lifting state, Redux, etc.) and why chosen.


3. UI Layout

The application should follow a three-column layout:

· Left (33%): To Do column – add new tasks here.

· Middle (33%): In Progress column.

· Right (33%): Done column.

Each column displays its tasks vertically. Tasks must be interactive (move/delete).


4. Technical Constraints & Rules


· No external drag-drop libraries (react-dnd, interact.js, konva.js) allowed.

· Must use React/Angular/Vue/React Native core features only.

· Code must compile and run locally using npm run start.

· Unit tests are required.

· App must not depend on any external API.


5. Deliverables

Your submission will be a single private GitHub repository containing:


· Source Code: Complete, runnable application.

· README.md: Clear build/run instructions.

· PROJECT_STRUCTURE.md: Explanation of folder/module layout.

· ARCHITECTURE.md:

· Chosen architectural pattern.

· Component hierarchy diagram.

· State management explanation.

· Why drag-drop was implemented the chosen way.

· CHAT_HISTORY.md: Prompt logs with coding assistant, including iterations and trade-offs.

· Video (5–7 min): Explaining design, architecture, AI journey, key decisions, and demo.

· TEST_STRATEGY.md: Document explaining testing coverage and rationale.
