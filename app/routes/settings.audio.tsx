import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Muted } from "~/components/text";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'

export default function SettingsAudio() {
    const navigate = useNavigate();

    const [quality, setQuality] = useState("3");

    useEffect(() => {
        const localQuality = localStorage.getItem('quality');
        if (localQuality) setQuality(localQuality);
    }, [])

    const saveSettings = () => {
        localStorage.setItem('quality', quality);
        navigate(-1);
    }

    return (
        <>
            <Muted>Audio</Muted>
            <div className="max-w-[500px] flex flex-col space-y-3 mt-3">
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
                    <Button onClick={() => { navigate(-1) }} variant="outline" className="w-full">Back</Button>
                </div>
            </div>
        </>
    )
}