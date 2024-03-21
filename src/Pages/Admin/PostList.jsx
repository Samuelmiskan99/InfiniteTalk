/* eslint-disable react/jsx-key */
import { Header } from "../../Components/Header"
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { FaArrowLeft } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeletePost, GetAllPosts } from "../../Services/index/posts";
import { FooterMain } from "../../Components/FooterMain";
import { Spinner, Table } from "flowbite-react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export const PostList = () => {
    const navigate = useNavigate();
    const userState = useSelector((state) => state.user);
    const queryClient = useQueryClient();

    const {
        data: postsData,
        isLoading,
        isFetching,
    } = useQuery({
        queryFn: () => GetAllPosts(),
        queryKey: ["posts"],
    });

    const { mutate: mutateDeletePost } =
        useMutation({
            mutationFn: ({ slug, token }) => {
                return DeletePost({
                    slug,
                    token,
                });
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["posts"]);
                toast.success("Post is deleted");
            },
            onError: (error) => {
                toast.error(error.message);
                console.log(error);
            },
        });

    const deletePostHandler = ({ slug, token }) => {
        mutateDeletePost({ slug, token });
    };

    useEffect(() => {
        if (!userState.userInfo) {
            const timeoutId = setTimeout(() => {
                navigate('/');
                toast.error("Not authenticated! Login first.")
            }, 50);
            return () => clearTimeout(timeoutId);
        }
    }, [userState.userInfo, navigate]);

    useEffect(() => {
        if (userState.userInfo.admin === false) {
            const timeoutId = setTimeout(() => {
                navigate('/feed');
                toast.error("Not an Admin!")
            }, 50);
            return () => clearTimeout(timeoutId);
        }
    }, [userState.userInfo, navigate]);


    useEffect(() => {
        if (!userState.userInfo.otp_valid && userState.userInfo.otp_enabled === true) {
            const timeoutId = setTimeout(() => {
                navigate('/otp');
                toast.error("OTP Not Authenticated.")
            }, 50);
            return () => clearTimeout(timeoutId);
        }
    }, [userState.userInfo, navigate]);

    return (
        <>
            <Header />
            <Helmet>
                <title>InfiniteTalk! - Manage Post Page</title>
            </Helmet>
            <div data-aos="zoom-in" className=' flex flex-col gap-4 justify-center items-center md:p-7 p-4'>
                <div className="flex flex-col w-full md:w-11/12 text-white rounded-lg p-5 bg-slate-800 shadow-lg">
                    <div className="flex items-center gap-2 justify-start cursor-pointer" onClick={() => navigate(-1)}>
                        <h1 className="text-2xl"> <FaArrowLeft /></h1>
                        <h1 className="text-2xl"> Manage Posts</h1>
                    </div>
                    <hr className="w-full h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                    <ul className="divide-y mt-4 mb-1 divide-gray-200 dark:divide-gray-400">
                        <li className="w-full rounded-lg p-2 bg-slate-700 text-center"> <h1 className="text-xl font-semibold">Welcome, <span className="text-green-500">{userState.userInfo.fullName}</span></h1> As an admin, you can control user posts </li>
                    </ul>
                    <h1 className="text-2xl font-semibold my-2">User Posts List</h1>
                    {
                        isLoading || isFetching ? (
                            <span className='flex gap-4'>Loading ... <Spinner size="sm" /></span>
                        ) : postsData?.data?.length === 0 ? (
                            <p className="text-red-500 p-2 font-semibold">There&apos;s no user posts</p>
                        ) : (
                            <div className="overflow-auto">
                                <Table>
                                    <Table.Body className="divide-y divide-gray-200 rounded-lg">
                                        <Table.Row className="bg-gray-700">
                                            <Table.Cell className="font-medium capitalize text-white">
                                                <Link>
                                                    <p>Post Title</p>
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium capitalize text-white">
                                                Posted at
                                            </Table.Cell>
                                            <Table.Cell className="font-medium capitalize text-white">
                                                Post owner
                                            </Table.Cell>
                                            <Table.Cell className="font-medium capitalize text-white">
                                                Post owner role
                                            </Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium capitalize text-white">
                                                Comments
                                            </Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium capitalize text-white">

                                            </Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium capitalize text-white">

                                            </Table.Cell>
                                        </Table.Row>
                                        {
                                            postsData?.data.map((post) => (
                                                <Table.Row className="bg-slate-700">
                                                    <Table.Cell className="font-medium capitalize text-white">
                                                        <Link to={`/post/${post?.slug}`}>
                                                            <p className="underline">{post.title}</p>
                                                        </Link>
                                                    </Table.Cell>
                                                    <Table.Cell className="font-medium capitalize text-white">
                                                        {post?.createdAt && (
                                                            new Intl.DateTimeFormat('en-GB', {
                                                                weekday: 'long',
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                                hour: 'numeric',
                                                                hour12: false,
                                                                minute: 'numeric',
                                                                timeZone: 'Asia/Jakarta',
                                                            }).format(new Date(post.createdAt))
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell className="font-medium capitalize text-white">
                                                        {post.user.fullName}
                                                    </Table.Cell>
                                                    <Table.Cell className="font-medium capitalize text-white">
                                                        {post?.user.mentor ? <span className="text-white text-sm">Mentor @ {post?.user.program}</span> : <span className="text-white text-sm">Mentee @ {post?.user.program}</span>}
                                                    </Table.Cell>
                                                    <Table.Cell className="font-medium capitalize text-white">
                                                        {post.comments && post.comments.length > 0 ? <span>{post?.comments.length} Comments</span> : "0 Comment"}
                                                    </Table.Cell>
                                                    <Table.Cell onClick={() => navigate(`/post/edit/${post?.slug}`)} className="hover:bg-yellow-600 hover:text-white font-medium capitalize text-yellow-500 cursor-pointer">
                                                        <FaEdit />
                                                    </Table.Cell>
                                                    <Table.Cell onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this post?")) {
                                                            deletePostHandler({
                                                                slug: post?.slug,
                                                                token: userState.userInfo.token,
                                                            });
                                                        }
                                                    }}
                                                        className="hover:bg-red-500 hover:text-white font-medium capitalize text-red-500 cursor-pointer">
                                                        <FaTrashAlt />
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        }
                                    </Table.Body>
                                </Table>
                            </div>
                        )}
                </div>

            </div>
            <FooterMain />
        </>
    )
}
