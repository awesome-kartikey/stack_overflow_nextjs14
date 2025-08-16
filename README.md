# Dev Overflow - A Stack Overflow Clone

![Dev Overflow Banner](https://i.ibb.co/x7FChRP/Thumbnail.jpg)

Dev Overflow is a full-stack web application mimicking the core functionalities of Stack Overflow. It allows users to ask questions, provide answers, vote on posts, tag content, manage their profiles, and interact within a developer community. This project utilizes modern web technologies including Next.js 14, TypeScript, MongoDB, and Clerk for authentication.

## ✨ Features

- **User Authentication:** Secure sign-up, sign-in, and profile management using Clerk.
- **Question & Answer System:**
  - Ask new questions with a rich text editor (TinyMCE).
  - Post answers to existing questions using the rich text editor.
  - Edit own questions and answers.
  - Syntax highlighting for code blocks within questions/answers (PrismJS).
- **Voting System:** Upvote/downvote questions and answers to indicate usefulness.
- **Tagging:** Assign tags to questions for categorization; browse questions by tag.
- **Search Functionality:**
  - **Global Search:** Search across questions, answers, users, and tags from the navbar.
  - **Local Search:** Search within specific pages like Home, Community, Tags, etc.
- **Filtering & Sorting:** Filter and sort questions, users, tags, and answers based on various criteria (newest, popular, votes, etc.).
- **User Profiles:** View user profiles, activity (questions/answers), reputation, and badges. Edit own profile information (name, username, bio, location, portfolio).
- **Community Page:** Browse all registered users, filter by contribution or join date.
- **Collections:** Save interesting questions to a personal collection.
- **Reputation System:** Earn reputation points based on contributions (asking questions, answering, receiving votes).
- **Badges:** Award badges based on predefined criteria (number of questions, answers, votes received, views).
- **AI-Powered Answers:** Generate potential answers using the Groq AI API.
- **Theming:** Switch between light and dark mode.
- **Responsive Design:** Adapts to various screen sizes with a mobile navigation drawer.
- **Sidebars:**
  - **Left Sidebar:** Main navigation links.
  - **Right Sidebar:** Displays top questions and popular tags.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 14 (App Router, Server Actions, Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Rich Text Editor:** [TinyMCE](https://www.tiny.cloud/)
- **AI Integration:** [Groq SDK](https://console.groq.com/docs/sdks)
- **Webhook Handling:** [Svix](https://www.svix.com/) (for Clerk webhooks)
- **Syntax Highlighting:** [PrismJS](https://prismjs.com/)
- **State Management:** React Context API (for Theme)

## ⚙️ Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/awesome-kartikey/stack_overflow_nextjs14.git
    cd stack_overflow_nextjs14
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**

    - Duplicate the `example.env` file and rename it to `.env.local`.
    - Fill in the required values:
      - `MONGODB_URL`: Your MongoDB connection string.
      - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key.
      - `CLERK_SECRET_KEY`: Your Clerk Secret Key.
      - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: Configure Clerk redirect URLs as needed (defaults are provided).
      - `NEXT_CLERK_WEBHOOK_SECRET`: Your Clerk Webhook signing secret (get from Clerk Dashboard -> Webhooks).
      - `NEXT_PUBLIC_TINY_EDITOR_API_KEY`: Your TinyMCE API key.
      - `GROQ_API_KEY`: Your Groq API key (for AI answers).
      - `OPENAI_API_KEY`: (Optional, if you plan to add OpenAI functionality).

    ```plaintext
    # .env.local
    MONGODB_URL=your_mongodb_connection_string
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_************************
    CLERK_SECRET_KEY=sk_test_************************
    NEXT_CLERK_WEBHOOK_SECRET=whsec_************************

    # Optional - Defaults are usually fine
    # NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    # NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    # NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    # NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    NEXT_PUBLIC_TINY_EDITOR_API_KEY=your_tinymce_api_key
    GROQ_API_KEY=your_groq_api_key
    OPENAI_API_KEY=your_openai_api_key # Optional
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 Usage

- Navigate the application using the left sidebar (or mobile navigation drawer).
- **Sign Up / Sign In:** Use the Clerk authentication forms to create an account or log in.
- **Ask a Question:** Click the "Ask a Question" button, fill in the title, detailed explanation (using the rich text editor), and add relevant tags.
- **Browse Questions:** View questions on the home page, filter them (Newest, Recommended, Frequent, Unanswered), or search using the local search bar.
- **View Question Details:** Click on a question title to see its content, answers, votes, and author details.
- **Answer:** On the question detail page, use the rich text editor to write and submit your answer.
- **Vote:** Use the up/down arrows next to questions and answers to vote.
- **Search:** Use the global search bar in the navbar to find content across the entire platform.
- **Tags:** Explore questions by clicking on tags or navigating to the Tags page.
- **Community:** View other users on the Community page.
- **Profile:** Access your profile via the sidebar link (when logged in) or by clicking usernames. Edit your profile details.
- **Collections:** Save questions by clicking the star icon on the question details page. Access your saved questions from the Collections page.
- **AI Answer:** On the answer form, click "Generate AI Answer" to get a suggestion from Groq.
