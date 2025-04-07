"use client"

import React, { use, useState } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadDropzone } from '@/utils/uploadthing';
import { ArrowLeft, Atom } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image';
import { toast } from 'sonner';

function CreatePage({ params }: { params: Promise<{ siteId: string }> }) {
    const { siteId } = use(params);

    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

    return (
        <>
            <div className="flex items-center">
                <Button size="icon" variant="outline" className='mr-3' asChild>
                    <Link href={`/dashboard/sites/${siteId}`}>
                        <ArrowLeft className='size-4' />
                    </Link>
                </Button>
                <h1 className='text-xl font-semibold'>Create Article</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Article Description
                    </CardTitle>
                    <CardDescription>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, vero?
                    </CardDescription>
                    <CardContent>
                        <form action="" className='flex flex-col gap-6'>
                            <div className="grid gap-2">
                                <Label>
                                    Title
                                </Label>
                                <Input placeholder='Next js blogging application' />
                            </div>
                            <div className="grid gap-2">
                                <Label>
                                    Slug
                                </Label>
                                <Input placeholder='Article Slug' />
                                <Button className='w-fit' variant="secondary" type='button'>
                                    <Atom className='size-4 mr-2' />
                                    Generate Slug
                                </Button>
                            </div>
                            <div className="grid gap-2">
                                <Label>Small Description</Label>
                                <Textarea placeholder='Small Description of your blog article...'
                                    className='h-32'
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Cover Image</Label>
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt='Uplading Image'
                                        className='object-cover w-[200px] h-[200px] rounded-lg'
                                        width={200}
                                        height={200}
                                    />
                                ) : (
                                    <UploadDropzone
                                        onClientUploadComplete={(res) => {
                                            setImageUrl(res[0].ufsUrl)
                                            toast.success("Image has been uploaded")
                                        }}
                                        endpoint="imageUploader"
                                        onUploadError={() => {
                                            toast.error("Something went wrong...")
                                        }}
                                    />
                                )}
                            </div>
                        </form>
                    </CardContent>
                </CardHeader>
            </Card>
        </>
    )
}

export default CreatePage
