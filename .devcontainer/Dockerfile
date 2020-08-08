#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.128.0/containers/javascript-node-14/.devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14

# ** [Optional] Uncomment this section to install additional packages. **

RUN apt-get update \
    && apt-get -qq update && apt-get -y -qq --no-install-recommends install ffmpeg \
    libxtst6 \ 
    libnss3 \
    libnspr4 \
    libxss1 \
    libasound2 \ 
    libgtk-3-0  \
    libgdk-pixbuf2.0-0 \
    lsb-release \
    xdg-utils \
    wget \
    xvfb \