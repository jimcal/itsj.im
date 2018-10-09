import Link from 'next/link'
import Head from 'next/head'

export default () => (
  <div>
    <Head>
      <title>Jim Liu</title>
    </Head>

    <div className="home">
      <div className="main">
        <h1>Jim Liu @ NODE+JS INTERACTIVE, Vancouver, BC.</h1>
        <nav>
          <a target="_blank" href="https://twitter.com/jimcalliu">Twitter</a>
          <a href="mailto:jimcal.liug@gmail.com">Email</a>
        </nav>
        <div>
          <li>Work: <a href="https://medium.com/@techatnordstrom"> Tech @ Nordstrom</a></li>
          <li>Volunteer: <a href="https://2018.cascadiajs.com/scholarships"> Scholarships @ CascadiaJS 2018</a> </li>
        </div>
      </div>
    </div>

    <style jsx>{`
      .home {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: -1;
      }

      .main {
        flex: none;
        text-align: center;
      }

      h1 {
        font-size: 14px;
        font-weight: normal;
      }

      nav {
        margin-top: 20px;
      }

      a {
        display: inline-block;
        margin: 0 15px;
        text-decoration: none;
      }
    `}</style>
  </div>
)
