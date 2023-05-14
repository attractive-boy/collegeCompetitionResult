import { GetServerSideProps } from 'next';

// 重定向
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { res } = context;
    res.writeHead(302, { Location: '/manage/notice' });
    res.end();
    return { props: {} };
};


export default function Manage() {
    
}
