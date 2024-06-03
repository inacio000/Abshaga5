"use client"

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImagePlus, TrashIcon, UploadCloudIcon } from "lucide-react";

interface ImagesUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    images: string[];
};

const ImagesUpload: React.FC<ImagesUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    images,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap justify-center items-center gap-4">
                {images.map((url) => (
                    <div
                        key={url}
                        className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
                    >
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                            sizes="24"
                        />
                    </div>
                ))}

            </div>
            <div className="flex justify-center items-center">
                <CldUploadWidget
                    uploadPreset="riu9ynvz"
                    onUpload={onUpload}
                >
                    {({ open }) => {
                        const onClick = () => {
                            open();
                        }

                        return (
                            <Button
                                type="button"
                                disabled={disabled}
                                variant="secondary"
                                onClick={onClick}
                                className="flex gap-2 border border-solid border-gray-500 text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
                            >
                                {/* <ImagePlus className="h-4 w-4" /> */}
                                <UploadCloudIcon className="h-5 w-5"/>
                                Upload Images
                            </Button>
                        )
                    }}
                </CldUploadWidget>
            </div>
        </div>
    )
}

export default ImagesUpload;