import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const AlumniRegistration = () => {
  return (
    <div className="flex justify-center items-center h-[80dvh] bg-gray-100 p-6">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Alumni Registration</CardTitle>
          <CardDescription>Reconnect and be part of our alumni network.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Fill out the form below to register as an alumni and stay updated with our events.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <a
              href="https://forms.gle/YOUR_GOOGLE_FORM_LINK"
              target="_blank"
              rel="noopener noreferrer"
            >
              Register Now <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlumniRegistration;
