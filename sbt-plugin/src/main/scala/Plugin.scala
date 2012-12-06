package info.schleichardt.sbt.browserreload

import sbt._
import Keys._

object SbtBrowserReloadPlugin extends Plugin
{

  class Watcher {
    val queue = new java.util.concurrent.LinkedBlockingQueue[String](1)
    def blockUntilChange() { queue.clear(); queue.take() }
    def fireChange() { queue.offer("new") }
  }

  lazy val watcher: Watcher = {
    object Watcher extends Watcher
    import com.sun.net.httpserver._
    import java.net._
    class BlockingServer extends HttpHandler {
      def handle(t: HttpExchange) {
        Watcher.blockUntilChange()
        val response = new java.util.Date().toString
        t.sendResponseHeaders(200, response.length())
        val os = t.getResponseBody()
        os.write(response.getBytes())
        os.close()
      }
    }
    val server = HttpServer.create(new InetSocketAddress(5555), 2)
    //call http://localhost:5555/poll
    //with only / for http://localhost:5555/ service reacts to favicon request
    //run play with play ~run
    server.createContext("/poll", new BlockingServer())
    server.setExecutor(null)
    server.start()
    Watcher
  }

  override lazy val settings: Seq[sbt.Project.Setting[_]] = Seq(
    compile in Compile ~= { analysis =>
      watcher.fireChange()
      analysis
    }, run in Compile ~= { r =>
      watcher//start watcher
      r
    }
  )
}