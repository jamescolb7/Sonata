'use client';

import { Title } from "@/components/Text";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

export default function Quality() {
    const router = useRouter();

    const [quality, setQuality] = useState("3");

    useEffect(() => {
        const localQuality = localStorage.getItem('quality');
        if (localQuality) setQuality(localQuality);
    }, [])

    const saveSettings = () => {
        localStorage.setItem('quality', quality);
        router.back();
    }

    return (
        <>
            <Title className="-mb-4">Audio</Title>
            <div className="max-w-[500px] flex flex-col space-y-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Audio Quality</CardTitle>
                        <CardDescription>Change the quality of the audio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={setQuality} value={quality}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="9">1411 Kbps (FLAC)</SelectItem>
                                <SelectItem value="3">320 Kbps (MP3)</SelectItem>
                                <SelectItem value="1">128 Kbps (MP3)</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
                <div className="flex space-x-3">
                    <Button onClick={saveSettings} className="w-full">Submit</Button>
                    <Button onClick={() => { router.back() }} variant="outline" className="w-full">Back</Button>
                </div>
            </div>
        </>
    )
}