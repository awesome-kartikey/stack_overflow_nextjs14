// components/forms/Answer.tsx
"use client"

import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { AnswerSchema } from '@/lib/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import React, { useRef, useState } from 'react' // Added React import
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '../ui/button'
import Image from 'next/image'
import { createAnswer } from '@/lib/actions/answer.action'
import { usePathname } from 'next/navigation'
import { useToast } from '../ui/use-toast' // Import useToast

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setSetIsSubmittingAI] = useState(false);
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const { toast } = useToast(); // Initialize useToast

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: ''
    }
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    // ... (keep existing logic)
     setIsSubmitting(true);

    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });

      form.reset();

      if(editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent('');
      }
       toast({ // Add success toast
         title: "Answer Submitted!",
         description: "Your answer has been posted successfully.",
       });
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({ // Add error toast
        title: "Submission Failed",
        description: "Could not submit your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false)
    }
  };

  const generateAIAnswer = async () => {
    if (!authorId) {
        toast({
            title: "Authentication Required",
            description: "You must be logged in to generate an AI answer.",
            variant: "destructive",
        });
        return;
    }
    if (!question) {
       toast({
         title: "Error",
         description: "Cannot generate answer without a question context.",
         variant: "destructive",
       });
       return;
    }

    setSetIsSubmittingAI(true);

    try {
      const response = await fetch(`/api/groq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      });

      const aiAnswer = await response.json();

      if (!response.ok || aiAnswer.error) {
         const errorMessage = aiAnswer.error || `API request failed with status ${response.status}`;
         throw new Error(errorMessage);
      }

      let formattedAnswer = aiAnswer.reply
          .replace(/\\n/g, '\n')
          .replace(/\n/g, '<br />');

      // Basic handling for Markdown code blocks -> HTML <pre><code>
      // FIX: Add string types to parameters
      formattedAnswer = formattedAnswer.replace(/```(\w+)?\s*<br \/>([\s\S]*?)<br \/>```/g, (_match: string, lang: string, code: string) => {
          const languageClass = lang ? ` class="language-${lang}"` : '';
          const decodedCode = code.replace(/<br \/>/g, '\n').replace(/</g, '<').replace(/>/g, '>').replace(/&/g, '&');
          return `<pre><code${languageClass}>${decodedCode}</code></pre>`;
      });
       // FIX: Add string types to parameters
       formattedAnswer = formattedAnswer.replace(/```\s*<br \/>([\s\S]*?)<br \/>```/g, (_match: string, code: string) => {
           const decodedCode = code.replace(/<br \/>/g, '\n').replace(/</g, '<').replace(/>/g, '>').replace(/&/g, '&');
          return `<pre><code>${decodedCode}</code></pre>`;
      });


      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
        toast({
           title: "AI Answer Generated",
           description: "The AI has generated an answer draft for you.",
        });
      } else {
         throw new Error("Editor not available.");
      }

    } catch (error: any) {
      console.error("Error generating AI Answer:", error);
      toast({
        title: "AI Generation Failed",
        description: error.message || "An unknown error occurred while generating the answer.",
        variant: "destructive",
      });
    } finally {
      setSetIsSubmittingAI(false);
    }
  };

  // --- Rest of the component ---
  return (
    <div className="mt-11"> {/* Added margin top for spacing */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>

        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          onClick={generateAIAnswer}
          disabled={isSubmittingAI} // Disable button while generating
        >
          {isSubmittingAI ? (
            <>
              <Image
                src="/assets/icons/reload.svg" // Optional: use a loading icon
                alt="Generating"
                width={12}
                height={12}
                className="animate-spin" // Add spin animation
             />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="star"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                        'searchreplace', 'visualblocks', 'codesample', 'fullscreen', // Added codesample
                        'insertdatetime', 'media', 'table'
                      ],
                      toolbar:
                        'undo redo | styles |' + // Added styles for heading/paragraph options if needed
                        'codesample | bold italic forecolor | alignleft aligncenter |' + // Added codesample
                        'alignright alignjustify | bullist numlist outdent indent | link image', // Added link/image
                      content_style: 'body { font-family:Inter; font-size:16px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'default', // Use 'default' or specify light theme CSS
                       codesample_languages: [ // Configure languages for codesample plugin
                           { text: 'HTML/XML', value: 'markup' },
                           { text: 'JavaScript', value: 'javascript' },
                           { text: 'CSS', value: 'css' },
                           { text: 'PHP', value: 'php' },
                           { text: 'Ruby', value: 'ruby' },
                           { text: 'Python', value: 'python' },
                           { text: 'Java', value: 'java' },
                           { text: 'C', value: 'c' },
                           { text: 'C#', value: 'csharp' },
                           { text: 'C++', value: 'cpp' },
                           { text: 'SQL', value: 'sql'},
                           { text: 'Bash/Shell', value: 'bash'},
                           { text: 'JSON', value: 'json'}
                        ],
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit !text-light-900" // Ensure text color is light
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Answer;