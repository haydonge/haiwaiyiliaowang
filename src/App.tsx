import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import "./i18n";

// 页面组件
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Pricing from "@/pages/Pricing";
import Process from "@/pages/Process";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import BlogAdmin from "@/pages/BlogAdmin";


// 布局组件
import Layout from "@/components/Layout";

// 加载组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/process" element={<Process />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin/blog" element={<BlogAdmin />} />

            <Route path="*" element={<div className="text-center text-xl py-20">页面未找到 / Page Not Found</div>} />
          </Routes>
        </Layout>
      </Suspense>
    </Router>
  );
}
