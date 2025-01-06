to start the project:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# What were the ideas behind...
### I was thinking about places which can slowdown user interaction
here is what I concluded:
1. because files can be large, and watching loader is not that fun.
I decided to try reading json file using stream api. So that user could 
interact with data asap.
unfortunately, on my pc, file upload was almost instant, even with 100к objects, so I left the code as a playground.
2. because we are working with large arrays, and we are not just displaying them we need to modify them.
So, I had to make data modifications so that, changing one object didnt trigger rerenders of all the array. It will need 
further profiling, tests and measurements, but for test purpose I think, thats enough
3. I also used technology called "virtual windowing", I used it once on my project. You mentioned that it will be a plus
to write it by my own. I worked with react-virtualized and with Tanstack Virtual but I havent dive into their source code,
neither asking chatgpt about their ideas.
To implement this technology I decided to track last visible element, so that, I can know, when to render next part of data.
That was working pretty fine, but after some time testing I came up with a bug, that if I scroll too fast, 
data wasnt rendered fast enough and I was stuck with no data... =)
so, next attempt was to listen for scroll position and calculate array range based on scroll position, total elements and client view.
to speed up I also made an assumption that the height of each element is fixed, but in the future it is okay to recalculate 
total height when new elements render and to cache already rendered heights...

4. Because of different types of data in array and the need to edit every field, I decided to create small converter from 
type to field renderer. I used chatgpt to convert "random json generator" to Typescript Type, then I also used it to create
an object with types to render it dynamically. I`ve used plain input fields with custom type based on field type.
I also used uncontrolled input controls.
5. to easy manipulate the data between components, and to prevent props drilling, I decided to use Jotai state manager. It`s like recoil, but 
with less boilerplate, its also from creators of Zustand, and it showed itself pretty well on my last project.

I havent test the solution well, but it should read the data from provided file, modify the data and save it later...

