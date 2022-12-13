## datum
---

#### **'datum'** is (in my use) slimmest, quickest markdown based blogging helper

### How it works? 
> * you keep your markdown blogs named as "YYYY-MM-DD.<any-name-at-all-without-dots>.md" in a data dir
> * provide this data dir path to datum and get your static blogging content to be served

---

Meaning:
> da·tum
> ˈdātəm,ˈdatəm/
> noun
> 1.
> a piece of information.
> 2.
> a fixed starting point of a scale or operation

---

> NOTE: datum doesn't bring in updates for boilerplate if changed post-creation, so required full cleanup and generation in such case

#### Example

I've attached a very 0-level original example (to be improved later, PR welcomed).
See the effect, change directory to datum's root... then

* to convert using Github API (requires Internet)
> DATUM_BASEDIR="example/" ./dat-2-um.sh

* to convert using Pandoc utlity (need to be installed using cabal)
> DATUM_CONVERTER="pandoc" DATUM_BASEDIR="example/" ./dat-2-um.sh

* if got some other boilerplate for blog
> DATUM_BOILERPLATE=simpleblog DATUM_CONVERTER="pandoc" DATUM_BASEDIR="example/" ./dat-2-um.sh

To change links from top-nav-bar and side-nav-bar; or to change Title, Heading, Subheading of blog... configure the desired values in **baseinfo.json** available at base of created blog-dir.

