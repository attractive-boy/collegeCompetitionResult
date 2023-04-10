import mammoth from 'mammoth';
//这里对docx文件进行转换，转换成html
export default async function convertDocToHtml(doc: any) {
    const result = await mammoth.convertToHtml({ arrayBuffer: doc.arrayBuffer() });
    return result.value;
}
        
        

