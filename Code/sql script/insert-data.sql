INSERT INTO users (user_id, username, user_email, user_password, is_admin) VALUES ("1", "user1", "user1@gmail.com", "123456", "0");
INSERT INTO users (user_id, username, user_email, user_password, is_admin) VALUES ("2", "user2", "user2@gmail.com", "123abc", "0");
INSERT INTO users (user_id, username, user_email, user_password, is_admin) VALUES ("3", "user3", "user3@gmail.com", "user3123", "0");
INSERT INTO users (user_id, username, user_email, user_password, is_admin) VALUES ("4", "user4", "user4@gmail.com", "user4123", "0");
INSERT INTO users (user_id, username, user_email, user_password, is_admin) VALUES ("5", "user5", "user5@gmail.com", "user5123", "1");

INSERT INTO tools (tool_id, fk_user_id, tool, title, description, code_snippet, tags, upvotes, flagged, last_update) VALUES ("1", "1", "git", "git init", "creates a new Git repository","git init", "CLI, Commands", 0, 0, CURRENT_TIMESTAMP);
INSERT INTO tools (tool_id, fk_user_id, tool, title, description, code_snippet, tags, upvotes, flagged, last_update) VALUES ("2", "1", "git", "git pull", "used to fetch and download content from a remote repository and immediately update the local repository to match that content","git pull", "CLI, Commands", 0, 0, CURRENT_TIMESTAMP);
INSERT INTO tools (tool_id, fk_user_id, tool, title, description, code_snippet, tags, upvotes, flagged, last_update) VALUES ("3", "1", "bash", "list local directories", "list the folders and files within the current directory","ls", "CLI, Commands", 0, 0, CURRENT_TIMESTAMP);
INSERT INTO tools (tool_id, fk_user_id, tool, title, description, code_snippet, tags, upvotes, flagged, last_update) VALUES ("4", "1", "bash", "create new folder", "create a new folder in currect directory","mkdir [option(s)] directory_name(s)", "CLI, Commands", 0, 0, CURRENT_TIMESTAMP);

INSERT INTO frameworks (framework_id, fk_user_id, framework, title, description, code_snippet, tags, upvotes, flagged, last_update) VALUES ("1", "3", "nodeJS", "create a HTTP server", "uses the node's http module to setup a simple web server","var http = require('http');http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello World!');
}).listen(8080);", "Javascript, nodeJS", 0, 0, CURRENT_TIMESTAMP);

INSERT INTO frameworks (framework_id, fk_user_id, framework, title, description, code_snippet, tags, upvotes, flagged, last_update) VALUES ("2", "4", "django", "django built-in user authentication module", "This code snipplet enable you to configure the django user authentication module to create new user for your application by extending the default django user model",
"class AppUser(models.Model):

    #one to one mapping of users from app user to default django user
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    #app level unique field.
    organisation = models.CharField(max_length=256, null=True, blank=True)

    #reference back to original model
    def __unicode__(self):
        return self.user.username
", "python, django", 0, 0, CURRENT_TIMESTAMP);


INSERT INTO languages (language_id, fk_user_id, language, title, description, code_snippet, tags, upvotes, flagged, last_update) VALUES (
"1", "1", "python", "merge 2 dictionary datatype", "this is how you merge 2 dictionary datatype",
"dictionary1 = {'name': 'Joy', 'age': 25}
dictionary2 = {'name': 'Joy', 'city': 'New York'}

merged_dict = {**dictionary1, **dictionary2}

print('Merged dictionary:', merged_dict)", "python, datatype, dictionary, common function", 0, 0, CURRENT_TIMESTAMP);

INSERT INTO languages (language_id, fk_user_id, language, title, description, code_snippet, tags, upvotes, flagged, last_update) VALUES (
"2", "2", "javascript", "while loop", "while loop loops through the code block within as long as the specified condition is true",
"while (i < 10) {
  text += 'The number is ' + i;
  i++;
}", "javascript, common function", 0, 0, CURRENT_TIMESTAMP);

SELECT * from frameworks;
SELECT * from languages;
SELECT * from tools;
SELECT * from users;


