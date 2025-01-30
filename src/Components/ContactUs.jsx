import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    message: z.string().min(10, "Message must be at least 10 characters."),
  });

  const ContactUs = () => {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
  
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        message: "",
      },
    });
  
    const onSubmit = async (data) => {
      try {
        await addDoc(collection(db, "MessageReceived"), {
          ...data,
          timestamp: serverTimestamp(),
        });
  
        setIsSubmitted(true);
        console.log("✅ Message stored in Firestore");
      } catch (error) {
        console.error("❌ Error sending message:", error);
        setError("Failed to send message. Please try again later.");
      }
    };

// const ContactUs = () => {
//   const navigate = useNavigate(); // ✅ Hook for navigation
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await addDoc(collection(db, "MessageReceived"), {
//         name: formData.name,
//         email: formData.email,
//         message: formData.message,
//         timestamp: serverTimestamp(),
//       });

//       setIsSubmitted(true);
//       console.log("✅ Message stored in Firestore (MessageReceived collection)");
//     } catch (error) {
//       console.error("❌ Error sending message:", error);
//       setError("Failed to send message. Please try again later.");
//     }
//   };

//   return (
//     <div className="contact-container">
//       {/* ✅ Navbar – Properly Positioned at the Top */}
//       <nav className="navbar">
//         <h1 className="logo">💬 Contact Us</h1>
//         <button className="home-btn" onClick={() => navigate("/")}>🏠 Home</button>
//       </nav>

//       <div className="contact-box">
//         <h2 className="title-glow">📡 Contact Us</h2>
//         <p className="subtitle">We’d love to hear from you! Send us a message 🚀</p>

//         {isSubmitted ? (
//           <div className="success-message">
//             <h3>✅ Message Sent Successfully!</h3>
//             <p>We will get back to you soon.</p>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="contact-form">
//             {error && <p className="error-message">{error}</p>}

//             <div className="input-group">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Your Name"
//                 className="neon-input"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Your Email"
//                 className="neon-input"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <textarea
//                 name="message"
//                 placeholder="Your Message"
//                 className="neon-textarea"
//                 value={formData.message}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button type="submit" className="send-btn">Send Message</button>
//           </form>
//         )}
//       </div>
//     </div>
//   );

 return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert className="mb-4">
              <AlertTitle>Message Sent!</AlertTitle>
              <AlertDescription>We will get back to you soon.</AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Your Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message Field */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your Message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full" onClick={() => navigate("/")}>
                  Send Message
                </Button>
              </form>
            </Form>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );



};

export default ContactUs;
