
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const HelloWorld = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Hello there!",
      description: "Thanks for clicking the button.",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
        Hello World
      </h1>
      
      <Card className="w-full max-w-md shadow-lg transition-all hover:shadow-xl">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>This is a simple Hello World app using React, Tailwind CSS and shadcn UI.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            This page demonstrates how to use shadcn UI components with Tailwind CSS to create a clean, modern interface.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={handleClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Click me!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HelloWorld;
