const app = require('express')();
const { S3Client, SelectObjectContentCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: 'ap-northeast-1' });

// オブジェクトストレージから検索
async function search_zip(zipcode) {
    const params = {
        Bucket: 'insight-demo-zipcode',
        Key: 'ken_all.csv',
        ExpressionType: 'SQL',
        Expression: `SELECT _3,_7,_8,_9 FROM S3Object WHERE _3 LIKE '${zipcode}'`,
        InputSerialization: { CSV: {} },
        OutputSerialization: { CSV: {} },
    };
    const search_result = await s3.send(new SelectObjectContentCommand(params));
    const records = [];
    for await (evnt of search_result.Payload) {
        if (evnt.Records)
            records.push(evnt.Records.Payload);
    }
    const record_array = Buffer.concat(records).toString('utf8').split('\n');
    record_array.pop();
    return record_array.map(record => record.split(','));
}

// API
app.get('/:zipcode', async (req, res) => {
    const zipcode = req.params.zipcode.replace(/[^0-9]/g, '').substr(0, 7) + '%';
    if (zipcode === '%')
        res.json([]);
    else
        res.json(await search_zip(zipcode));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
