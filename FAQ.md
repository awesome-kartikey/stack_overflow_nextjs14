# FAQ.md

# Frequently Asked Questions (FAQ)

Here are some common questions about the Dev Overflow project.

**1. What is Dev Overflow?**

> Dev Overflow is a full-stack web application designed as a clone of the popular Q&A platform, Stack Overflow. It allows developers to ask programming-related questions, provide answers, vote on content, use tags for organization, and interact within a community.

**2. Why was this project built?**

> This project was likely built as a portfolio piece to showcase skills in modern web development technologies, including Next.js 14, TypeScript, MongoDB, Clerk authentication, Tailwind CSS, and integrating third-party APIs like Groq for AI features. It demonstrates the ability to build complex, interactive web applications.

**3. How does user authentication work?**

> Authentication is handled using [Clerk](https://clerk.com/). Clerk provides pre-built UI components for sign-up and sign-in, manages user sessions, and handles user data synchronization via webhooks (`app/api/webhook/route.ts`). User details are stored both in Clerk and mirrored in the application's MongoDB database (`database/user.model.ts`) for relationship mapping with questions, answers, etc.

**4. What database is used, and how is it structured?**

> The application uses MongoDB as its database, with Mongoose as the Object Data Mapper (ODM). The main data models are:
>
> - **User:** Stores user profile information (linked to Clerk ID), reputation, saved questions.
> - **Question:** Stores question details (title, content, author, tags, votes, views, answers).
> - **Answer:** Stores answer content, author, associated question, votes.
> - **Tag:** Stores tag names, descriptions, and associated questions.
> - **Interaction:** Records user actions like viewing questions or answering, used for features like reputation and potentially recommendations.

**5. How does the AI-generated answer feature work?**

> When a user clicks the "Generate AI Answer" button on the answer form (`components/forms/Answer.tsx`), a request is sent to a Next.js API route (`app/api/groq/route.ts`). This route securely uses the `GROQ_API_KEY` to query the Groq AI service (specifically a Llama model like `llama-3.1-8b-instant`) with the context of the current question. The AI generates a potential answer, which is then sent back to the frontend and populated into the TinyMCE editor for the user to review and edit before submitting.

**6. How is the reputation system implemented?**

> Reputation points are awarded or deducted based on specific user actions, defined within the server actions (`lib/actions/`). For example:
>
> - Asking a question: +5 points (`lib/actions/question.action.ts`)
> - Answering a question: +10 points (`lib/actions/answer.action.ts`)
> - Receiving an upvote on a question/answer: +10 points for the author (`lib/actions/question.action.ts`, `lib/actions/answer.action.ts`)
> - Receiving a downvote on a question/answer: -10 points for the author (specific logic might vary)
> - Upvoting content: +1 point for the voter (`lib/actions/question.action.ts`)
> - Downvoting content: -2 points for the voter (specific logic might vary)
>   The user's total reputation is stored in the `User` model.

**7. How are badges awarded?**

> Badges (`GOLD`, `SILVER`, `BRONZE`) are calculated based on criteria defined in `constants/index.ts` under `BADGE_CRITERIA`. These criteria include counts for questions asked, answers provided, upvotes received on questions/answers, and total views on questions. The `assignBadges` utility function (`lib/utils.ts`) likely calculates these counts when fetching user stats (e.g., in `lib/actions/user.action.ts -> getUserInfo`).

**8. Can I contribute to this project?**

> As this appears to be a personal or portfolio project, contribution guidelines are not explicitly defined. If you are interested in contributing, you would typically:
>
> 1.  Fork the repository.
> 2.  Create a new branch for your feature or bug fix.
> 3.  Make your changes.
> 4.  Submit a Pull Request to the original repository owner, explaining your changes.

**9. What are the prerequisites to run this project locally?**

> You need:
>
> - [Node.js](https://nodejs.org/) (version compatible with Next.js 14, typically v18 or later)
> - A package manager: `npm`, `yarn`, or `pnpm`
> - Access to a [MongoDB](https://www.mongodb.com/) database (local or cloud-based like MongoDB Atlas)
> - A [Clerk](https://clerk.com/) account to obtain API keys.
> - A [TinyMCE](https://www.tiny.cloud/) API key.
> - A [Groq](https://console.groq.com/) account for an API key (for the AI feature).

**10. How is styling handled?**

> Styling is primarily done using [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS. [shadcn/ui](https://ui.shadcn.com/) is used for pre-built, customizable UI components (like Buttons, Forms, Dialogs, etc.) which integrate seamlessly with Tailwind. Custom styles and theme variables (for light/dark mode) are defined in `app/globals.css` and `styles/theme.css`. Syntax highlighting uses [PrismJS](https://prismjs.com/) with a custom theme (`styles/prism.css`).

**11. Can this project be deployed?**

> Yes, as a Next.js application, it's designed for deployment on platforms that support Node.js environments, such as [Vercel](https://vercel.com/) (recommended for Next.js), Netlify, AWS, or traditional servers. Ensure all environment variables are correctly configured in the deployment environment.
