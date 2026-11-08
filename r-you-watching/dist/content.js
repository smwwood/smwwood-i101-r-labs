export const introduction = {
 subtitle: 'Your show. Your data. Your investigation.',
 paragraphs: ["In this homework, you’ll investigate a television show of your choice using real episode data from TVmaze. You’ll use R to explore the show’s ratings, look for patterns across episodes, and investigate which words appear in episode descriptions.", "You don’t need to collect the data yourself. This website will retrieve it for you. Your job is to use R to explore the data, create graphs, and see what you discover."],
 helpers: [['bar_graph(data, x, y)','Makes a bar graph'],['line_graph(data, x, y)','Makes a line graph'],['count_by(data, x)','Counts observations in groups']]
};
export const investigations = [
 {
  title:'Graph 01: Episode Ratings',short:'Ratings',intro:'Explore how the ratings of your show’s episodes are distributed.',createTitle:'Create your histogram',
  guidance:[
   'Use hist(), a built-in R function, to make a histogram of the episode ratings. It takes a numerical vector: hist(numerical_vector).',
   'Your data is saved in the variable rated_episodes. The $ symbol selects a column, so rated_episodes$rating gives you the ratings. Episodes without valid ratings have already been removed.'
  ],
  hint:'Replace numerical_vector in hist(numerical_vector) with the rating column. Type the command in the basic editor and run it.',
        starter:'# Preview the column/variable names with names().\n# The only argument names() needs is your dataset, rated_episodes.\n\n\n# Create a histogram using hist().\n# Use the rating column from rated_episodes.\n# Remember that the $ symbol selects a column from your data.\n',
  example:'hist(scores, col = "turquoise3", border = "white", main = "My title")',
  exampleNote:'This syntax example uses an imaginary vector named scores. Keep the rating column from your working graph when you add arguments.',
  options:[['Fill color','col = "turquoise3"'],['Border color','border = "white"'],['Suggested number of bins','breaks = 12'],['Main title','main = "A Consistently Great Show"'],['Subtitle','sub = "Episode ratings from TVmaze"'],['X-axis label','xlab = "Episode rating"'],['Y-axis label','ylab = "Number of episodes"'],['Title size','cex.main = 1.3'],['Axis text size','cex.axis = 0.9'],['Label size','cex.lab = 1.1'],['Axis-label orientation (horizontal text)','las = 1'],['X-axis limits','xlim = c(0, 10)'],['Y-axis limits','ylim = c(0, 30)']],
  customizationNote:'R may treat breaks as a suggested number of bins, rather than an exact count. Axis limits can hide observations or cut off bars; choose ranges that show your data. Use a title supported by what you see.',
  questions:[
   {id:'concentration',label:'1. Where are most of your show’s episode ratings concentrated?',help:'A short range or a sentence is enough.'},
   {id:'shape',label:'2. How would you describe the shape of the histogram?',options:['Left-skewed (longer tail toward lower ratings)','Right-skewed (longer tail toward higher ratings)','Approximately symmetric','No clear pattern / hard to tell'],help:'Skew refers to the direction of the longer tail, not the location of the tallest bars.'},
   {id:'prediction',label:'3. Based on the shape of your histogram, what would you predict about the mean and median?',options:['The mean would be higher.','The median would be higher.','They would be about the same.','It’s difficult to predict from this histogram.'],reason:'Briefly explain your reasoning. How might unusually high or low ratings influence the mean?',help:'Make your prediction first. You are welcome to check it in either R editor using mean() and median() on the rating column. There is no automatic grading: the usual relationship is a tendency, not a rule for every distribution.'},
   {id:'personal',label:'4. Do these ratings match your own impression of the show?',help:'Mention a surprise, an agreement or disagreement, or how the ratings compare with what you know. If you haven’t watched the show, discuss your expectations or what interests you.'}
  ]
 },
 {
  title:'Graph 02: Ratings Over Time',short:'Trends',intro:'Investigate how episode ratings change throughout your show’s run.',createTitle:'Create your graph',
  guidance:[
   'Use the line_graph(data, x, y) helper function. Choose rated_episodes as your data frame, episode_order for the x-axis, and rating for the y-axis. Column names go in without quotation marks.',
   'Episodes are already arranged across the whole series. If Season 1 has ten episodes, S02E01 has episode_order 11. Unrated episodes leave gaps in the sequence. Use head() to inspect episode_order, episode_label, and rating.',
  ],
  hint:'The first argument is a data frame; the second and third are the unquoted x and y column names.',
     starter:'# Inspect episode order, episode labels, and rating.\n# Here is an example of how you would use head() to \n# preview runtime data: head(rated_episodes)\n\n# Create a line graph of rating across episode_order.\n# episode_order should be the x-axis variable\n# Use the rated_episodes data frame.\n',
  example:'line_graph(my_data, sequence, score, col = "steelblue", lwd = 3)',
  exampleNote:'my_data, sequence, and score are example names. Keep your own data frame and columns, and add arguments after them.',
  options:[['Line color','col = "steelblue"'],['Line thickness','lwd = 3'],['Line style (dashed)','lty = 2'],['Lines and points','type = "b"'],['Point shape (filled circle)','pch = 19'],['Point size','cex = 0.7'],['Main title','main = "Ratings Across the Series"'],['Subtitle','sub = "Aired episodes with ratings"'],['X-axis label','xlab = "Episode order"'],['Y-axis label','ylab = "Episode rating"'],['Y-axis limits','ylim = c(0, 10)'],['X-axis limits','xlim = c(1, 100)']],
  customizationNote:'Changing axis limits can make differences look larger or smaller, and can exclude observations. The x-axis example ends at episode 100; adjust it to fit your show. Point shape and size are visible with a point-drawing type such as "b" or "o".',
  questions:[
   {id:'pattern',label:'1. What overall pattern do you see in your show’s ratings?',options:['Ratings generally increase.','Ratings generally decrease.','Ratings remain fairly stable.','Ratings fluctuate without a clear overall trend.']},
   {id:'standout',label:'2. Is there an episode or stretch of episodes that stands out?',help:'Briefly describe what makes it unusual.'},
   {id:'personal',label:'3. How does this pattern compare with your own impressions of the show?',help:'You might mention a favorite or least favorite episode or season. If the show is unfamiliar, describe what seems surprising or interesting.'}
  ]
 },
 {
  title:'Graph 03: Episode Storylines',short:'Storylines',intro:'Explore which characters, events, or themes appear in your show’s episode descriptions.',createTitle:'Create your graph',
  guidance:[
   'Remember the sample() function from lab. The sample() function needs two arguments: (1) what data and (2) how many randomly chosen samples. For example, sample(my_data$names, 3) would provide 3 random names from my_data. For this exercise, use rated_episodes$summary to get samples of the summary column of rated_episodes data frame.',
   'Choose four words or short phrases connected to characters, places, events, or themes. Use grepl() to determine whether each episode summary contains each keyword/phrase you chose. Remember that grepl() also needs two arguments: (1) the text you’re looking for and (2) where you’re looking for it! For example, if I wanted to look for the name Sally in the names column of my_data, I would use grepl("Sally", my_data$names).',
   'We did not talk about this in lab, but you can also tell grepl() to search for all matches regardless of capitalization by adding one more argument: ignore.case = TRUE. In my Sally example, it would look like this: grepl("Sally", my_data$names, ignore.case = TRUE).',
   'We will walk you through counting the TRUE values in each column and building a small table to store them in the R editor comments.',
   'Finally, use bar_graph(data, x, y) to graph the table. You are counting episode descriptions that mention each term, not the number of individual word occurrences. Each description counts at most once per term.'
  ],
  hint:'Recall grepl("family", rated_episodes$summary, ignore.case = TRUE). Store a search using rated_episodes$family <- grepl(...), choosing your own term and column name. TRUE counts as 1 and FALSE as 0 in sum(). For the table, use data.frame(word = c(...), count = c(...)). Substring matches are fine; fixed = TRUE can treat punctuation in a phrase literally.',
       starter:"# 1. Use sample() to review several summaries from rated_episodes$summary.\n# Choose four words or short phrases from what you read.\n\n\n# 2. Create a TRUE/FALSE column in rated_episodes for each term.\n# For example, for the show Friends, I might create rated_episodes$chandler\n# to store appearances of the name Chandler.\n# Here's the syntax for grepl: grepl('word you are looking for in quotes', data$column, ignore.case = TRUE)\n# Repeat for all four terms.\n\n\n# 3. Next you will create new variables to store each count. \n# Count the TRUE values in each new column with sum().\n# In my Friends example, I could use chandler <- sum(rated_episodes$chandler).\n\n\n# 4. Use c() to combine your four chosen words/phrases into a vector.\n# Put each label in quotation marks. Save this vector in a variable called words.\n# For example, words <- c('the farmer', 'and', 'the dell')\n\n\n# 5. Use c() to combine your four count variables into a vector.\n# Keep counts in the same order as their labels. Save it in a variable called counts.\n# Use variable names here, without quotation marks.\n# For example, counts <- c(the_farmer, and, the_dell)\n\n\n# 6. Build a data frame with data.frame().\n# Name its first column word and give it your words vector.\n# Name its second column count and give it your counts vector.\n# Separate the two column arguments with a comma.\n# Use <- to save the resulting data frame as word_counts.\n# If you used the variable names words and counts, as suggested, \n# you should be able to use the code word_counts <- data.frame(words = words, counts = counts)\n\n\n# 7. Let's check that each word matches its count in our word_counts table.\nprint(word_counts)\n\n\n# Use bar_graph() with word_counts as your data, \n# words as your x-axis, and count as your y-axis.\n",
  example:'bar_graph(my_counts, term, total, col = "steelblue", border = "white")',
  exampleNote:'The table and column names above are examples. Keep word_counts and its columns from your working graph when you add styling arguments.',
  options:[['Bar colors (recycled across bars)','col = c("turquoise3", "steelblue")'],['Bar borders','border = "white"'],['Horizontal bars','horiz = TRUE'],['Space between bars','space = 0.5'],['Main title','main = "Words in Episode Descriptions"'],['Subtitle','sub = "Descriptions mentioning each term"'],['Axis text orientation (horizontal)','las = 1'],['Category-label size','cex.names = 0.9']],
  customizationNote:'Optional sorting changes your data frame before plotting: word_counts <- word_counts[order(word_counts$count, decreasing = TRUE), ]. Then run your bar graph command. Because R objects are shared between editors, this reorders the table used in later runs; your saved basic graph and code stay unchanged.',
  questions:[
   {id:'most',label:'1. Which of your chosen words or phrases appeared in the most episode descriptions?'},
   {id:'themes',label:'2. What might the relative frequencies of these words suggest about the show’s characters or themes?'},
   {id:'personal',label:'3. Do these results fit with what you think the show is really about?',help:'Briefly compare the results with your experience or expectations. You do not need to have watched the show.'}
  ],
  interpretationNote:'Episode summaries are selective, human-written descriptions. A word appearing more frequently does not necessarily mean that its character or theme is more important to the show.'
 }
];
