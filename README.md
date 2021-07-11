# Wait for URLs to be available
[![build](https://github.com/ViliusSutkus89/WaitForURLsToBeAvailable/actions/workflows/build.yml/badge.svg)](https://github.com/ViliusSutkus89/WaitForURLsToBeAvailable/actions/workflows/build.yml)

## The why
I need to pause a CI workflow until a set of URLs become available.

## Example workflow

```yaml
name: build
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: ./library/buildAndPublish
      - id: getPublishedLibraryURLs
        run: echo ::set-output name=URLs::'["https://www.example.org/file1", "https://www.example.org/file2"]'

      - uses: ViliusSutkus89/WaitForURLsToBeAvailable@v1
        with:
          URLs: ${{ steps.getPublishedLibraryURLs.outputs.URLs }}

      - uses: ViliusSutkus89/WaitForURLsToBeAvailable@v1
        with:
          URLs: '["https://www.example.org/file3", "https://www.example.org/file4"]'

      - run: ./applicationDependingOnPublishedLibrary/build  
```

## Inputs
Name | Required | Description
--- | --- | ---
URLs | Yes | JSON encoded array of URLs to be checked
timeoutSeconds | No, defaults to 60 | How long to wait after a failed check before retrying?
tryCount | No, defaults to 20 | How many times to try checking before assuming failure?
