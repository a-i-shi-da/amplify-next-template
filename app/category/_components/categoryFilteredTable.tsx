'use client'

import {Card,Typography,Button} from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {QuizForCatScreen} from '@/app/_types/quiz'
import Link from 'next/link'

type Props = {
    quizzes:QuizForCatScreen[],
    largeCategory:string,
    smallCategory?:string
}

export function CategoryFilteredTable({quizzes,largeCategory,smallCategory}:Props){

    return (
        <>
            <Card className="max-w-4xl mx-auto mt-3 shadow-lg">
            <Typography variant="h6" gutterBottom>
                {`大カテゴリ：${largeCategory} ${smallCategory ? `小カテゴリ:${smallCategory}`:""} `}
            </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="My Quizzess">
                    <TableHead>
                        <TableRow>
                        <TableCell>問題文</TableCell>
                        {smallCategory ? <></> : <TableCell>小カテゴリ</TableCell>}
                        <TableCell>作成者</TableCell>
                        <TableCell>作成日</TableCell>
                        <TableCell sx={{fontSize:'15px',whiteSpace:'nowrap'}}>挑戦する</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quizzes.map((q,index) => (
                        <TableRow
                            key={q.quizId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" sx={{whiteSpace: "pre-line"}}>
                            {q.question}
                            </TableCell>
                            {smallCategory ? <></> : <TableCell>
                                <Link href={`/category/${encodeURIComponent(largeCategory)}/${encodeURIComponent(q.smallCategory)}`}
                                className='text-blue-600 hover:text-blue-800' >{q.smallCategory}
                                </Link>
                                </TableCell>}
                            <TableCell>{q.createdBy}</TableCell>
                            <TableCell>{q.createdAt}</TableCell>
                            <TableCell>
                                <Link href={`/solve/${q.quizId}`}>
                                    <Button variant="contained" color='primary' sx={{fontSize:'10px',whiteSpace:'nowrap'}}>挑戦する</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </>
        
    )
}