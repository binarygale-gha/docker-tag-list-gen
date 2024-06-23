# `docker-tag-list-gen`

An action that generates a comma-seperated list of tags to push via `docker/build-push-action`. This is especially helpful if you want to push a tag to multiple registries, or if you want to push a semver-based tag hierarchy.

## Inputs

- `roots`: Required. A list of image roots you want to push to. For example `docker.io/example/example-repo,ghcr.io/example/example-repo`. You can add spaces and newlines if you want.
- `tags`: Optional. A list (comma-seperated strings) of static tags you want to push to each registry, for example `static`.
- `hierarchical_version`: Optional. A dot-seperated version number to generate hierarchical tags for, for example `1.2.0`. For your convience, this will strip a leading `v`. So if you're running this on a tag named `v1.2.0`, you can pass `${{ github.ref_name }}` directly into this.

Note that either `tags` or `hierarchical_version` is required.

## Outputs

- `tags`: A comma-seperated list of tags to pass into `docker/build-push-action`.

## Example use

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: ${{ vars.DOCKERHUB_USER }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: binarygale-gha/docker-tag-list-gen@v1
        id: tag_list
        with:
          roots: |
            docker.io/${{ github.repository }},
            ghcr.io/${{ github.repository }}
          tags: latest
          hierarchical_version: ${{ github.ref_name }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.tag_list.outputs.tags }}
```

If run on a tag named `v1.2.3` in an repo `example/foobar`, this would push:

- `docker.io/example/foobar:latest`
- `docker.io/example/foobar:1`
- `docker.io/example/foobar:1.2`
- `docker.io/example/foobar:1.2.4`
- `ghcr.io/example/foobar:latest`
- `ghcr.io/example/foobar:1`
- `ghcr.io/example/foobar:1.2`
- `ghcr.io/example/foobar:1.2.4`
