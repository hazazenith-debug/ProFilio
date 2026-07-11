import { useNavigate } from 'react-router-dom'
import { FiCode, FiEye, FiZap } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { Lightbulb, Code2, Eye } from "lucide-react";
import { Zap } from "lucide-react";
import { useAuth } from '../context/AuthContext';

export function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            navigate('/builder');
        } else {
            navigate('/signin');
        }
    };

    return (
        <div>
            <div className="hero">
                <div className="text">
                    <div className="tag">
                        <div className="logo-icon-tag">
                            <Zap size={14} strokeWidth={2.5} />
                        </div>
                       <span>AI-Powered Portfolio Builder</span>
                    </div>
                    <h1 className="head-tag">Build Your Developer Portfolio with AI</h1>
                    <p style={{fontWeight:'450', }}>Create a stunning portfolio in minutes. Our AI analyzes your GitHub activity and generates optimized content that showcases your best work.</p>
                </div>
                <div className="buttons">
                    <button className="btn-1" onClick={handleGetStarted}>Get Started Free</button>
                </div>

            </div>

            <div className="landing">
                <div className="boxes">
                    <div className="box-1">
                        <div className="icon-box-1">
                            <Lightbulb size={24} strokeWidth={2} />
                        </div>

                        <h1 style={{color:'#050505', fontWeight:'500',fontSize:'20px', letterSpacing:'0.5px'}} >AI-Generated Content</h1>
                        <p>Smart descriptions and project summaries tailored to your coding style and expertise</p>
                    </div>
                    <div className="box-2">
                        <div className="icon-box-2">
                            <Code2 size={24} strokeWidth={2} />
                        </div>
                        <h1 style={{color:'#050505', fontWeight:'500',fontSize:'20px', letterSpacing:'0.5px'}}>GitHub Integration</h1>
                        <p>Automatically import your projects and showcase your contributions with live data</p>
                    </div>
                    <div className="box-3">
                        <div className="icon-box-3">
                            <Eye size={24} strokeWidth={2} />
                        </div>
                        <h1 style={{color:'#050505', fontWeight:'500',fontSize:'20px', letterSpacing:'0.5px'}}>Live Preview</h1>
                        <p>See your portfolio come to life in real-time as you build with instant updates</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
