# curlimport

A CLI tool and library for converting curl commands into decomposed `fetch` statements.

The motivation is to help in reverse engineering backends and iterate going from requests in the dev console to something more structured, e.g. as explained [here](https://spudtrooper.github.io/articles/fromcurltogo).

## Install

```bash
./scripts/install.sh
```

or

```
yarn global add https://github.com/spudtrooper/curlimport
```

## Usage

After [installing](#install),

```bash
curlimport convert --curl_string "curl 'https://www.metopera.org/api/seating/GetSeatmapBackgroundPaths?seatmapId=ea8fad31-bae8-4d36-a15d-f939af56d51b' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'cookie: INSTITUTION_LOGOUT=True; ASP.NET_SessionId=XXXX;' \
  -H 'dnt: 1' \
  -H 'pragma: no-cache' \
  -H 'referer: https://www.metopera.org/smart-seat/?performanceNumber=17416' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
"
```

outputs

```js
fetch(
  "https://www.metopera.org/api/seating/GetSeatmapBackgroundPaths?" +
    new URLSearchParams({
      seatmapId: "ea8fad31-bae8-4d36-a15d-f939af56d51b",
    }).toString(),
  {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      dnt: "1",
      pragma: "no-cache",
      referer: "https://www.metopera.org/smart-seat/?performanceNumber=17416",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      cookie: Object.entries({
        INSTITUTION_LOGOUT: "True",
        "ASP.NET_SessionId": "XXXX",
      })
        .map(([k, v]) => k + "=" + v)
        .join("; "),
    },
    body: null,
    method: "GET",
  },
);
```

and this lets you fidddle with the parts of the fetch more easily.

## FAQ

**Q: Why curl to fetch and not fetch to fetch?**

**A:** I don't know an easy way to do the latter. There's a library for the former.
