import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BgImg from "../assets/Background1.jpg";
import { BookCheck, BriefcaseIcon, GraduationCap, LineChart, ArrowRight, Shield, Zap, Award, TrendingUp, ChevronRight, Star, Users, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import HomeImg2 from '../assets/HomeImg2.jpg'

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookCheck,
      title: "Readiness Evaluation",
      description: "Submit your CV and academic performance for review. Get actionable feedback from university admins before applying to companies.",
      color: "indigo",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      icon: BriefcaseIcon,
      title: "Curated Job Board",
      description: "Access exclusive internship postings from verified industry partners. Apply instantly once your readiness status is approved.",
      color: "purple",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: GraduationCap,
      title: "Smart Portfolios",
      description: "Build a dynamic skill portfolio. Highlight your tech stack and certifications so admins can match you to the perfect role.",
      color: "sky",
      gradient: "from-sky-500 to-cyan-600"
    },
    {
      icon: LineChart,
      title: "Direct Mentorship",
      description: "Communicate directly with university supervisors. Receive mock interview notes and guidance to close your skill gaps.",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  const stats = [
    { value: "500+", label: "Partner Companies", icon: Users },
    { value: "2,500+", label: "Students Placed", icon: TrendingUp },
    { value: "95%", label: "Success Rate", icon: Award },
    { value: "48h", label: "Avg. Response Time", icon: Clock }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-slate-50 to-white">
      
      {/* =========================================
          HERO SECTION (Enhanced with Better Overlay)
          ========================================= */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat scale-110"
            style={{ backgroundImage: `url(${BgImg})` }}
          />
          <div className="absolute inset-0 " />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <Navbar />
          <div className="flex-grow flex items-center justify-center pb-20">
            <Header />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* =========================================
          STATS SECTION
          ========================================= */}
      <section className="py-16 px-4 sm:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-2xl text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          KEY FEATURES SECTION (Enhanced Cards)
          ========================================= */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
            <Shield size={16} className="text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 tracking-wide">WHY CHOOSE US</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Bridging Academia and Industry
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A complete ecosystem designed to prepare university students for the professional world, 
            evaluate their skills, and connect them with top employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative bg-white p-8 m-px rounded-2xl">
                  <div className={`bg-${feature.color}-50 w-14 h-14 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  
                  {/* Learn More Link */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:gap-2 transition-all">
                      Learn more <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS SECTION (Enhanced Split Layout)
          ========================================= */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
              <Zap size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600 tracking-wide">SIMPLE PROCESS</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Your Path to Placement
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've streamlined the internship process to ensure you are fully prepared before stepping into the corporate world.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Side: Image with Overlay */}
            <div className="w-full lg:w-1/2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={HomeImg2} 
                    alt="Students collaborating on projects" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* Right Side: Steps with Timeline */}
            <div className="w-full lg:w-1/2 space-y-12">
              
              {/* Step 1 */}
              <div className="relative flex gap-6 group">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div className="absolute left-7 top-14 w-px h-24 bg-gradient-to-b from-indigo-300 to-transparent hidden lg:block" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-slate-900">Register & Build Portfolio</h4>
                    <Star size={18} className="text-indigo-500 fill-indigo-500" />
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Create your secure account, verify your university email, and add your technical skills to your smart portfolio. Get started in under 5 minutes.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-6 group">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div className="absolute left-7 top-14 w-px h-24 bg-gradient-to-b from-purple-300 to-transparent hidden lg:block" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-slate-900">Admin Evaluation</h4>
                    <Shield size={18} className="text-purple-500" />
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Submit your CV for review. University supervisors will evaluate your readiness, suggest courses, and grant internship eligibility within 48 hours.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-slate-900">Apply & Get Hired</h4>
                    <TrendingUp size={18} className="text-emerald-500" />
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Once approved, unlock the Job Board. Browse curated internships from our industry partners and apply with a single click. Track your applications in real-time.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          TESTIMONIAL SECTION (New Addition)
          ========================================= */}
      <section className="py-24 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
              <Users size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600 tracking-wide">SUCCESS STORIES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              What Our Students Say
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of students who have successfully launched their careers through TalentTracer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Student {i}</h4>
                    <p className="text-sm text-slate-500">Placed at Tech Corp</p>
                  </div>
                </div>
                <p className="text-slate-600 italic">
                  "TalentTracer transformed my internship search. The readiness evaluation and mentorship helped me land my dream role at a top tech company."
                </p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-indigo-500 text-indigo-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          CTA SECTION (Enhanced Footer)
          ========================================= */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Zap size={16} className="text-indigo-300" />
            <span className="text-sm font-semibold text-indigo-200 tracking-wide">START YOUR JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to kickstart your career?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join TalentTracer today and take the first step toward your dream internship. 
            Your future career awaits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/login')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-8 rounded-full transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
            >
              Access Student Portal 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-full transition-all backdrop-blur-sm border border-white/20"
            >
              Create Free Account
            </button>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 text-slate-400 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} TalentTracer. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Admin Login</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;