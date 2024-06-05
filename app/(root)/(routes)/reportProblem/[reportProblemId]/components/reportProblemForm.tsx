"use client";

import * as z from "zod";
import axios from "axios";
import { LocationOfTheProblem, ReportImage, ReportProblem } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import ImagesUpload from "@/components/images-upload";
import { useEffect, useState } from "react";

interface ReportProblemFormProps {
    formattedData: ReportProblem | null;
    locationOfTheProblem: LocationOfTheProblem[];
}

interface Floor {
    id: string;
    number: number;
}

interface Block {
    id: string;
    number: number;
}

interface Room {
    id: string;
    number?: string;
}

const PREAMBLE = `Yesterday the lamp was on all day, overnight I turned it off, but when I turned it back on this morning, it just broke. But before that happened, it was already looking a little weird, different from the normal color of a lamp.`;

// type ReportFormValues = z.infer<typeof formSchema> & { roomId: string };

const formSchema = z.object({
    problemTittle: z.string().min(1, { message: "Problem Title is required" }),
    description: z.string().min(50, { message: "Description required at least 50 characters" }),
    reportImage: z.object({ url: z.string() }).array(),
    locationProblemId: z.string().min(1, { message: "Location is required" }),
    floorId: z.string().min(1, { message: "Floor is required" }),
    blockId: z.string().min(1, { message: "Block is required" }),
    roomId: z.string().min(1, { message: "Room is required" }),
});

const problemPlaces = [
    { name: " Room | " },
    { name: "Toilet | " },
    { name: "Block" }
]

export const ReportProblemForm: React.FC<ReportProblemFormProps> = ({
    locationOfTheProblem
}) => {
    // const params = useParams();
    const { toast } = useToast();
    const router = useRouter();
    const [floors, setFloors] = useState<Floor[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            problemTittle: "",
            description: "",
            reportImage: [],
            locationProblemId: "",
            floorId: "",
            blockId: "",
            roomId: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formattedData = {
                ...data,
                reportImage: data.reportImage.map(image => ({ url: image.url }))
            };

            console.log("Dados formatados antes do envio:", formattedData);

            await axios.post(`/api/reportProblem`, formattedData);

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
            console.log(error);
        }
        console.log(data)
    };

    useEffect(() => {
        const fetchFloors = async () => {
            try {
                const response = await axios.get('/api/floors');
                setFloors(response.data);
            } catch (error) {
                console.error('Error fetching floors:', error);
            }
        };

        fetchFloors();
    }, []);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const response = await axios.get('/api/blocks');
                setBlocks(response.data);
            } catch (error) {
                console.error('Error fetching blocks:', error);
            }
        };

        fetchBlocks();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('/api/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleFloorChange = async (floorId: string) => {
        form.setValue('floorId', floorId);
        form.setValue('blockId', '');
        form.setValue('roomId', '');

        try {
            const response = await axios.get(`/api/blocks?floorId=${floorId}`);
            setBlocks(response.data);
        } catch (error) {
            console.error('Error fetching blocks:', error);
        }
    };

    const handleBlockChange = async (blockId: string) => {
        form.setValue('blockId', blockId);
        form.setValue('roomId', '');

        try {
            const response = await axios.get(`/api/rooms?blockId=${blockId}`);
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

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
                                ))}
                            </p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="reportImage"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-center space-y-4 col-span-2">
                                <FormControl>
                                    <ImagesUpload
                                        images={field.value.map((image: { url: string }) => image.url)}
                                        disabled={isLoading} onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current: any) => current.url !== url)])}
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
                                <FormItem>
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
                    <FormField
                        control={form.control}
                        name="floorId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Floor</FormLabel>
                                <Select disabled={isLoading} onValueChange={(value) => {
                                    field.onChange(value);
                                    handleFloorChange(value);
                                }} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue defaultValue={field.value} placeholder="Select floor" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {floors.map((floor) => (
                                            <SelectItem key={floor.id} value={floor.id}>{floor.number}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select the floor where the problem is located.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="blockId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Block</FormLabel>
                                <Select disabled={isLoading} onValueChange={(value) => {
                                    field.onChange(value);
                                    handleBlockChange(value);
                                }} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue defaultValue={field.value} placeholder="Select block" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {blocks.map((block) => (
                                            <SelectItem key={block.id} value={block.id}>{block.number}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select the block where the problem is located.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roomId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room</FormLabel>
                                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue defaultValue={field.value} placeholder="Select room" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {rooms.map((room) => (
                                            <SelectItem key={room.id} value={room.id}>{room.number}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select the room where the problem is located.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={isLoading}
                                        placeholder={PREAMBLE}
                                        className="resize-none bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Write a description for the problem
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={isLoading}
                        className="ml-auto"
                        type="submit"
                    >
                        Send
                    </Button>
                </form>
            </Form>
        </div>
    );
};