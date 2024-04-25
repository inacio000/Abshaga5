"use client"

import * as z from "zod";
import axios from "axios";
import { LocationOfTheProblem, ReportProblem } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface ReportProblemFormProps {
    initialData: ReportProblem | null;
    locationOfTheProblem: LocationOfTheProblem[];
}

const PREAMBLE = `Yesterday the lamp was on all day, overnight I turned it off, but when I turned it back on this morning, it just broke. But before that happened, it was already looking a little weird, different from the normal color of a lamp.`;

const formSchema = z.object({
    problemTittle: z.string().min(1, {
        message: "Problem Tittle is required"
    }),
    description: z.string().min(50, {
        message: "Description required at least 50 characters"
    }),
    src: z.string().min(1, {
        message: "Image is required"
    }),
    locationProblemId: z.string().min(1, {
        message: "Location is required"
    }),
})

const problemPlaces = [
    { name: " Room | " },
    { name: "Toilet | " },
    { name: "Block" }
]

export const ReportProblemForm = ({
    initialData,
    locationOfTheProblem
}: ReportProblemFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            problemTittle: "",
            description: "",
            src: "",
            locationProblemId: undefined
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/reportProblem", values);

            toast({
                description: "Report sent.",
                duration: 3000,
            });

            router.refresh();
            router.push("/");
            
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong.",
                duration: 3000,
            });
        }
        console.log(values)
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 pb-10"
                >
                    <div className="space-y-2 w-full col-span-2">
                        <div>
                            <h3 className="text-lg font-medium">Reporting a Problem</h3>
                            <p className="text-sm text-muted-foreground">Report a technical problem of your
                                {problemPlaces.map((item) => (
                                    <span 
                                    key={item.name}
                                    className="font-bold">
                                        {item.name}
                                    </span>
                                )
                                )}
                            </p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="src"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-center space-y-4 col-span-2">
                                <FormControl>
                                    <ImageUpload
                                        disable={isLoading} onChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )}
                    />
                    <div className="flex gap-6 flex-col justify-center md:flex-row md:justify-between">
                        <FormField
                            name="problemTittle"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Problem Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Broken lamp"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Write a name problem
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="locationProblemId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem Location</FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue defaultValue={field.value} placeholder="Select location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locationOfTheProblem.map((location) => (
                                                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select the location where you have the problem.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={isLoading} rows={7} className="bg-background resize-none" placeholder={PREAMBLE} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Write here in detail what happened, to help the Technician in solving the problem.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading}>
                            {initialData ? "Edit Problem Report" : "Send Problem Report"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}