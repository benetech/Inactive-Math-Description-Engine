This text is intended as a basic instruction for those who are intending to expand on the MDE.

The MDE is a very complex program which uses a huge number of classes.  What I'll try to do here is briefly explain the role of each of the major components of the MDE.  You will have to learn most of the code on your own.  First, we shall examine each of the main classes and then we shall look at how they interact with each other.

The MDE can handle either equations OR a set of data points.  An equation can be either cartesian or polar and are represented as an AnalyzedEquation.  A set of data points is represented as a AnalyzedData.

Classifiers are another important component of the engine.  Classifiers determine what kind of graph an equation represents.  For instance, classifiers determine that an y=mx+ b graph is a linear equation, a y=ax^2 +bx +c graph is a quadratic graph.  

SolvedGraphs are representations of the graphs.  They calculate and return features to the engine so that a proper description of the graph can be made. Different children of SolvedGraph exist for different equations: SolvedLine corresponds with linear equations, SolvedParabola with quadratic equations.  Recently, we have added interfaces to be implemented with these graphs to retrieve the features that are specific to the graph.  For instance, SlopedFeature provides the method for retrieving slope from graphs with slopes.

The Solver takes equations and data as inputs and acts as a driver for these program.  You add equations to the Solver, then run solve to calculate the features of the corresponding graphs.

The Describer in responsible for getting all of the calculated features into an XML format and then using them to create a human readable output.  There are currently three description modes the MDE can use: MATH, VISUAL, and STANDARDS.  Most of the current work has been on standards as we wished most of the initial work done by NASA to remain intact.

The Solver and the Describer exist at the top.  Adding a String to the Solver gets it turned into an AnalyzedEquation once it is parsed.    Once an AnalyzedEquation is created, it will determine the appropriate classifier for it.  After, when Solver.solve() is called, the AnalyzedEquation will the ask the Classifier to tell it what kind of SolvedGraph it is, which will generate the features- such as slope, y intercepts, or vertex- specific to the graph represented by the AnalyzedEquation.  The Describer will be called at the very end to retrieve the description.

You can test various inputs to get descriptions, graphs, or sonifications using the built in "tutorial classes."  Tutorial_CommandLineDescriber.java is probably the best bet to get a good grasp of the proper wake to use Solver and describer

If you wish to add new types of graphs to be recognized by the MDE, then you there is quite a bit of work ahead of you.  Multiple things need to be done to accomplish this task, though not necessarily in this order:
-  Add a new Classifier or edit an existing one.
- Create a new chid of SolvedGraph to represent this type of equation.
- Calculate the features in this new child.
-  Modify Analyzed Equation to detect this type of graph so that it can call up the appropriate classifier to call the correct SolvedGraph. (only necessary if you create a new classifier)
- Modify the XSL file to recognize the new type of graph and create the new descriptions


A couple of examples:  When I created a more robust description of cubic polynomials, I created the SolvedCubicPolynomial, then added this line in PolynomialClassifie:
else if(degree==3){
            	features = new SolvedCubicPolynomial(analyzedEq);
            } 
to determine the new SolvedGraph that I wanted to send it to.  Then I filled SolvedCubicPlynomial with all the features I wanted it to cover and modified the XSL file accordingly. 

When I had to create support for more robust descriptions of trigonomic functions, I created a new classifier and then a new type of SolvedGraph to go along with it, but I also had to detect "sin," "cos," and "tan" from within AnalyzedEquation so we could tell the graph contains trig components in it.  

Hopefully this document will be able to help you get started on modifying the MDE.  
If it can't email me. 

--Andrew Rosen
Retsej@gatech.edu

PS 

Need to work on improving regexes.

Also make the domain and range more accessable for TTS engines.