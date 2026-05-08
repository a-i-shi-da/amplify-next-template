import {Button} from '@mui/material'
import { client } from "./_components/provider";

import {logger} from '@/app/_lib/logger'
import Link from 'next/link'

export default async function App() {

   return (
    <main className='m-2 p-2'>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
   
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="text-center bg-white rounded-xl shadow-sm p-6 border-t-4 border-blue-600">
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">クイズ作成</h1>
          <p className="text-gray-600">ローコードでクイズを簡単に作成できます</p>
        </div>
        <div className="p-5">
          <p className="text-lg text-center">会員登録してクイズを作成するか、ゲストとしてクイズに挑戦しましょう。</p>
          <div className="flex justify-center m-6">
            <Link href="/create"><button className="p-5 m-4 text-3xl text-white bg-blue-600 rounded hover:bg-blue-900">クイズ作成画面へ</button></Link>
            <Link href="/categories"><button className="p-4 m-4 text-2xl text-white bg-green-600 rounded hover:bg-green-900">クイズカテゴリ一覧へ</button></Link>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}
