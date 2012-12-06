package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {
  
  public static Result index() {
    Logger.info("--> index called");
    return ok(index.render("Your new application is ready."));
  }
}