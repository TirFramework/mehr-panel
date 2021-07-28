import DefaultLayout from '../layouts/DefaultLayout'
// import Input from "../components/Input";

import React, { lazy, useEffect, useState } from 'react';
// import shortid from 'shortid';


const importView = subreddit =>
    lazy(() =>
        import(`../components/${subreddit}`).catch(() =>
            import(`./404`)
        )
    );


const searchSubreddit = async query =>
    fetch(
        `http://localhost:8000/fields.json`
    ).then(_ => _.json());

function Create({ subredditsToShow }) {
    const [views, setViews] = useState([]);

    const extractData = response =>
        response.data.children.map(({ data }) => data);

    useEffect(() => {
        async function loadViews() {
            const subredditsToShow = await searchSubreddit(
                'react hooks'
            ).then(extractData);
            const componentPromises = subredditsToShow.map(
                async data => {
                    const View = await importView(data.subreddit);
                    return (
                        <View key='1' {...data} />
                    );
                });

            Promise.all(componentPromises).then(setViews);
        }

        loadViews();
    }, [subredditsToShow]);


    return (
        <React.Suspense fallback='Loading views...'>
            <div className='container'>{views}</div>
        </React.Suspense>
    );
}

export default Create;
 