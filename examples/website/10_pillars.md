# 10 Pillars Related to Low-Code

## Background

The view for most people in leadership/management roles today is that the process of software development is far too slow. Website, web app, and native mobile app development takes too long to put into production and is too expensive. Historically, software development makes huge productivity leaps roughly every 10 years. You can see this as we moved from mainframes to data centers, data centers to cloud servers, and moving from 1st to 2nd to 3rd generation programming languages (e.g. 1GL machine, 2GL assembly, 3GL: javascript). We haven’t made a large leap forward in productivity in ~15 years and we’re overdue for the next phase.


I set out to look for the next step forward in software productivity. I
have documented the 10 core pillars that will lead software development
for the next 10-15 years. For this article's purposes, I will look at it
from a manager's point of view. For example, let's say a company has
been able to get by without a CTO, but now, they need one to take their
productivity to the next level. You, the reader, is hired to be the new CTO.
How do you lead a team of intelligent VPs, Directors, and managers of
software development to the next level?


I discovered LOW-CODE when I went looking for the next wave of software
development effectiveness. We have gone through many waves, such as
mainframes, mini's (like DEC), and data centers. Now, we use cloud
computing. Worth mentioning, is that when we had data centers, budgets
were $10MM+. Now with the cloud, the same company's budget has dropped
to below $1MM. Academically speaking, if you have a computer science
degree, you know about 1st generation language (1GL) machine, 2GL
assembly, and 3GL; and it begs the question as to what will 4GL be?
Computers have become much more powerful with every decade that passes,
and as a result, has improved in effectiveness almost ten-fold in the
software development category! Nevertheless, we have not had a
productivity jump in software development for almost 10-15 years. If you
have been developing software for less than 15 years, you may not expect
a new wave to change everything.

There are many good LOW-CODE tools: Airtable, BettyBlocks, Pega, ServiceNow, OutSystems, Bubble or you can even consider MBaaS tools as well; and even Form builders


# Solution

Below I have outlined the 10 pillars that will lead a company to the
next level in software development productivity and efficiencies.

Not only does it allow managers to do
more with a smaller team, (I'll say like adding an accounting system
lets you do more accounting with less bookkeepers, but it also allows
those that are less technical to partake in web app development, which
is becoming more white collar as computing power is increasing.

## Pillar 1: A Specific Agile Approach

Current Agile treats WAH and remote development as exceptions. An agile
flavor, called Stanford Flash Teams (SFT), is far more cost effective
and assumes being remote is a key part of the team. Iterative, or
incomplete iterations, while helpful, is a bit more difficult to teach.
One can replace daily stand-ups by incorporating regular syncs with
screen recordings.

## Pillar 2: UX and User-Oriented Teams

Developers love to build, and that includes building useless things. The
tech leaders could use 'Intercept/Observe'
techniques - e.g. screen recordings of users using the Web App to share
with the tech team. If one fails to do this, the team will be talking
about bits and bytes and not the things that truly matter in the market.
Further, some teams spend a considerable amount of time playing, giving
in to every temptation available. Similarly, do UI first, then backend.

## Pillar 3: Admin

One key is that CMS (Blog/Website, or similar) also requires an admin
app, such as CMS apps have. One cause of this productivity jump is
leveraging the technique of static generation. When building an app, also build 
and admin app for the same - to be used by admins. 

## Pillar 4: Team Players

Maybe one's org develops at a slow; or fast pace. However, without art
directors and designers, the web app, also known as digital interactive,
would look bad in the market. The ratio of designers to developers on a
team is changing. Perhaps a team has 1 designer for 4-5 developers
today, yet in the future, a team may have 2-3 designers per developer;
and by designer, it should go without saying that I am referring to a
designer that knows CSS. In any event, an individual contributor must
know how to work with designers, while possessing polyglot skills in
more than one SASS framework. NIH is poor productivity; it is better to
leverage a documented CSS framework.  Also development is iterative. 

## Pillar 5: Learn Quickly

Regardless of how anyone feels about it, in this vocation, one must be
able to master things quickly, and 'forget' older things. So, if O.O. and
F.P. are over, one must learn the coming (4GL) declarative low-code. One
example of declarative LOW-CODE is already known by a large percent of
NodeJS developers that use NodeJS 'Express' library: It uses Pug instead
of HTML. Markup is how eBay develops software, using its less popular
'Marko', that is similar to Pug. If one has never used Pug, it is a bit like a more powerful
version of something called 'Markdown'; Pug is compatible with PHP,
Python, etc. The most common way to use declarative LOW-CODE is with
static generators, as mentioned above. With that being said, yes, one
does write dynamic apps and dynamic data binding by utilizing static
generators. (* There is an article linked from mBake.org to a Medium article regarding dynamic binding.) 
A static generator takes the developer-friendly declarative
low-code and generates less friendly html and js, similar to how designers
use SASS to generate CSS.

Be prepared to retrain again, for the coming declarative low-code; the
upcoming development and prominence cannot be stopped due to the
increased productivity it offers. 

## Pillar 6: SEO

There are many orgs competing for consumers, and no one will try a web
app unless they can discover it, making SEO imperative. SEO includes
AMP, whether it is favored or not, making it a requirement that
generators should be able to write both a web app page and an AMP
version of it. There is clearly much more to SEO than just this, but it
is an important aspect that should not be ignored.

## Pillar 7: No Negativity (Towards DRY)

DRY is good. Using a single code base to target multiple
platforms, a more hybrid approach. The best way to learn how to perform
hybrid development is to first learn Electron. This is to not be
confused with the current approach of React-native: that is two code
bases, one for web and one for devices. As a tech leader, I want a
single code base, otherwise known as a hybrid approach.

Once Electron has been learned, one can then try build.phonegap.com,
version 8.0+; A faster/cheaper development with full native
functionality and performance with a single code base available for Web,
IOS, Android, PWA, with one single code base! Of course, there are
people that want to use Swift | Java, but that is not a part of the
long-term future. 

## Pillar 8: Solve Software Apocalypse of Cloud v1.0

We moved from data centers to Cloud v1, but then used the familiar and
dated architecture, and was only recently moved to the cloud. To be
frank, it is a mess of an architecture diagram and fails to be
maintainable.

Cloud v2.0 is fully server-less. E.g. AWS Amplify or better Google
FireStore. For example: user auth is client side only. A good first
project is to move user auth Google FireBase and use FireStore for CRUD.
Again, it is purely client side. Alternatively, one can host and mount a
web app on S3, without the need for FTP, and additionally, use CDN for
https certs.

If one tries it, they will agree that year over year, head count for
back-end programmers will progress towards 0. The cost savings are akin
to going from Data Center to Cloud v1.0. With that being said, going
from Cloud v1.0 to Cloud v2.0 is a huge benefit, and produces a similar
amount of fear.

An example of a good early step would be to create a 'ViewModel' layer in you web-apps client side; so that 
that you app is agonistic to the back end. And embrace server-less, go heavy into AWS S3, Google Firestore and similar.

## Pillar 9: Security

CIO and HR are tech related. Companies that want to be safe are
moving to PC-in-the-cloud (http://shop.shadow.tech/usen). For instance,
one can be browser only in their org, with Chrome-book or a similar OS. They can do that
company-wide, an employee-friendly way to lock down. 
In any case, we
find ourselves developing in the cloud often. We often use tools like SSH
Vi, but also have the option to use a Web-IDE, such as CodeAnywhere;
the point is that in the future, we will be doing more development
on the web. Not only is the app running in the cloud: development is in the cloud as well.

## Pillar 10: Benchmarking

One must be able to benchmark their org vs another org in our
industry. Answers to questions such as how quickly an org in their industry segment
developer software, how many pages or screens per day per developer, are
a few examples on the web. The most important part is knowing one's
productivity; how many pages or screens, per day per developer are they
doing? Ideally one compares this number before LOW-CODE and after
low-code pillars, as well as to their operating costs.

(And if you have to use PHP to be productive, than do it)

# Get Started

The next wave of development productivity is coming, and we can see that
it will be low-code. LOW-CODE is the way to create
front-end web and application development.

You can see a LOW-CODE CRUD example here:

-   https://github.com/MetaBake

You can run it by installing MetaBake from
here:

-   https://www.staticgen.com/MetaBake

## mBake.org

If your organization would like to try one or more of the low-code
pillars, please [contact
me](mailto:vic@mBake.org?subject=10%20Pillars%20of%20Low%20Code%20Inquiry).
We can teach your team on-site!

Or, if you have a project that you want to do in 1/10th of the time at
1/10th of the cost, we will build it for you. 

### Written in Typora