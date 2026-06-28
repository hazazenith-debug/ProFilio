import { useNavigate } from 'react-router-dom'

export function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="hero">
                <div className="text">
                    <p className="tag">⚡️ AI-Powered Portfolio Builder</p>
                    <h1>Build Your Developer Portfolio with AI</h1>
                    <p>Create a stunning portfolio in minutes. Our AI analyzes your GitHub activity and generates optimized content that showcases your best work.</p>
                </div>
                <div className="buttons">
                    <button className="btn-1" onClick={() => navigate('/builder')}>Get Started Free</button>
                    <button className="btn-2">Watch Demo</button>
                </div>
                <div className="pros">
                    <p>✅ No credit card required</p>
                    <p>✅ Setup in 5 minutes</p>
                    <p>✅ Free forever</p>
                </div>
            </div>

            <div className="landing">
                <div className="boxes">
                    <div className="box-1">
                        <img src="" alt="" />
                        <h1>AI-Generated Content</h1>
                        <p>Smart descriptions and project summaries tailored to your coding style and expertise</p>
                    </div>
                    <div className="box-2">
                        <img src="" alt="" />
                        <h1>GitHub Integration</h1>
                        <p>Automatically import your projects and showcase your contributions with live data</p>
                    </div>
                    <div className="box-3">
                        <img src="" alt="" />
                        <h1>Live Preview</h1>
                        <p>See your portfolio come to life in real-time as you build with instant updates</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
