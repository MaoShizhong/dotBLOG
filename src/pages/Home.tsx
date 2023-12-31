import { fetchData } from '../helpers/fetch_options';
import { useEffect, useState } from 'react';
import { Errors } from './AccountHandler';
import { ErrorList } from '../components/ErrorList';
import { PostPreview } from '../components/posts/PostPreview';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components/Loading';

type Author = {
    name: string;
    username: string;
};

type Category = 'javascript/typescript' | 'html' | 'css' | 'other';

export type Post = {
    _id: string;
    author: Author;
    title: string;
    imageURL?: string;
    imageCredit?: string;
    timestamp: string;
    category: Category;
    text: string;
    commentCount: number;
    isPublished: boolean;
    isFeatured: boolean;
    objectFit: string;
    url: string;
    clientURL: string;
};

export function Home() {
    const { posts, featuredPost, errors, loading } = useGetPosts();

    return (
        <main className="flex justify-center py-10 w-main">
            {errors || !posts ? (
                <ErrorList errors={errors} />
            ) : loading ? (
                <Loading text="Fetching articles..." />
            ) : (
                <div className="flex flex-col grid-cols-2 auto-rows-auto sm:grid sm:gap-6">
                    {featuredPost && <PostPreview post={featuredPost} featured={true} />}

                    {posts &&
                        posts.map(
                            (post): JSX.Element => (
                                <PostPreview key={post._id} post={post} featured={false} />
                            )
                        )}
                </div>
            )}
        </main>
    );
}

function useGetPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
    const [errors, setErrors] = useState<Errors>(null);
    const [loading, setLoading] = useState(true);

    const navigateTo = useNavigate();

    useEffect((): void => {
        (async (): Promise<void> => {
            const res = await fetchData('/posts', 'GET');

            if (res instanceof Error) {
                navigateTo('/error');
            } else {
                const resAsJSON = await res.json();

                if (res.ok) {
                    setPosts(resAsJSON);
                    setFeaturedPost(resAsJSON.find((post: Post): boolean => post.isFeatured));
                } else {
                    setErrors(resAsJSON);
                }
            }

            setLoading(false);
        })();
    }, []);

    return { posts, featuredPost, errors, loading };
}
