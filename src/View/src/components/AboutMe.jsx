export function AboutMe({ aboutMe, setAboutMe }) {

  return (
    <div className="form-box">
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="about-me">About Me</label>
          <textarea
            value = {aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            id="about-me"
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
          ></textarea>
        </div>
      </form>
    </div>
  );
}
