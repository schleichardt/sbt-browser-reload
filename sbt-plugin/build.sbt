sbtPlugin := true

version := "0.1-SNAPSHOT"

name := "sbt-browser-reload"

organization := "info.schleichardt" 

scalaVersion := "2.9.1"

publishTo := Some(Resolver.file("file",  new File(Path.userHome.absolutePath+"/Projekte/schleichardt.github.com/jvmrepo"))(Resolver.mavenStylePatterns))

publishMavenStyle := true