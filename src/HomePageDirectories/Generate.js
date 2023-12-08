import React, { useState, useEffect } from "react";
import generateBlogs from "../openaiServices";
import pbService from "../services";

const GeneratePage = () => {
  // component states
  const [prompt, setPrompt] = useState(""); // set user prompt
  const [generatedBlogs, setGeneratedBlogs] = useState([]); // set all generated blogs
  const [loading, setLoading] = useState(false); // set loading flag for api calls

  useEffect(() => {
    // Get all blogs from database for specific user
    const getAllBlogs = async () => {
      setLoading(true);
      const blogs = await pbService.getBlogs();
      let new_blogs = [];
      for (let i = 0; i < blogs.length; i++) {
        new_blogs.push(blogs[i]['content']);
      }
      setGeneratedBlogs(new_blogs);
      setLoading(false);
    }
    getAllBlogs();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    // call OpenAI service to generate new prompt
    await generateBlogs(prompt)
    .then( async (response) => {
      const content = response 
      const new_blog = await pbService.createBlog(content);
      setGeneratedBlogs([...generatedBlogs, new_blog['content']]);
    })
    setLoading(false);
  }
  
  return (
    <div className="min-w-screen min-h-screen p-10 pr-36 pl-36">
      <form onSubmit={handleSubmit} className="flex  justify-center items-center bg-slate-100 border rounded-md p-2 mb-5">
      <span className="text-black text-base font-bold mr-2 w-44">Blog Description: </span>
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="text-black rounded-md p-2 mr-5 w-full"
        />
        
        <button 
          disabled={loading}
          type="submit"
          className={`text-white px-2 py-2 bg-blue-500 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Generate
        </button>
      </form>
      {loading &&
        (
            <div className="bg-slate-100 w-72 h-56 flex justify-center items-center rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-90">
            <span className="text-black text-2xl font-bold mb-2 mt-4">Generating Blog...</span>
          </div>

        ) 
      }
      <div className="flex flex-col justify-center items-center border p-1 rounded-md bg-slate-100">
        {generatedBlogs.length > 0 && <h1 className="text-black text-2xl font-bold mb-2 mt-4">Generated Blogs</h1>}
        {generatedBlogs.length === 0 && <h1 className="text-black text-2xl font-bold mb-2 mt-4">No Blogs Generated</h1>}
        {generatedBlogs.map((blog, index) => (
          <div key={index} className="text-white mt-4 flex flex-col border p-2 rounded-md bg-white">
            <span className="text-black text-xl font-bold mb-2">Blog {index + 1}</span>
            <span className="text-black">{blog}</span>
          </div>
        ))}
      </div>
        

        
    </div>
  );
}

export default GeneratePage;








