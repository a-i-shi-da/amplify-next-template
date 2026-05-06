'use client'
import { useRouter } from "next/navigation"
import { Typography,Card,Button,Box } from "@mui/material"

export default function NotFoundQuiz(){
    const router = useRouter()

    return(
        <Card className="max-w-4xl mx-auto mt-3 shadow-lg">
            <Typography variant="h6" gutterBottom>
                対象のクイズは存在しないか、削除されたか、アクセス権がない可能性があります。
                下の戻るボタンまたはブラウザの戻るボタンを押して元のページに戻ってください。
            </Typography>
            <Box className="mt-3 text-center">
                <Button variant="contained" size="large" color="secondary" onClick={()=>{router.back()}}>戻る</Button>
            </Box>
        </Card>
    )
}