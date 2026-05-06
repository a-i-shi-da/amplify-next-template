'use client'

import Link from 'next/link';
import {
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Card,
  Typography,
} from '@mui/material';

type LargeCategoryCount = {
    largeCategory:string,
    count :number
}

type Props = {
    largeCategories:LargeCategoryCount[]
}


export function LargeCategoryRecords({largeCategories}:Props){

    return (
        <Card className="max-w-4xl mx-auto mt-3 shadow-lg">
            <Typography variant='h6'>カテゴリ一覧</Typography>
            <List>
                {largeCategories.map((l) => (
                    <ListItemButton
                    key={l.largeCategory}
                    component={Link}
                    href={`/category/${encodeURIComponent(l.largeCategory)}`}
                    >
                    <ListItemText primary={l.largeCategory} />
                    <Chip label={l.count} size="small" />
                    </ListItemButton>
                ))}
            </List>
        </Card>
    )
}