# Guide To Elementor

# Table of Contents

1. [Overview](#overview)
   1. [Pre-requisites](#pre-requisites)
1. [Configuration](#configuration)
   1. [XAMPP](#xampp)
   1. [WordPress](#wordpress)
1. [Getting Started](#getting-started)
   1. [Plugins](#plugins)
   1. [Elementor](#elementor)
1. [Useful Functions](functions.md)
1. [Style Snippets](styles.md)
1. [Custom Scripts](scripts.md)
1. [Full Snippets](snippets.md)

# Overview

My guide to building with WordPress and Elementor

## Pre-requisites

- [XAMPP](https://bitnami.com/stack/xampp)
- [WordPress](https://wordpress.org/)

# Configuration

## XAMPP

- Run the installer to install
- Under **Select Components**, select
  - Apache
  - MySQL
  - PHP &
  - phpMyAdmin
- When done, run as administrator. Head to config and setup the following
  - Autostart MySQL and Apache
  - Start control panel minimised

## WordPress

- Go to `C:\xampp\htdocs` and create a new folder
- Extract WP archive files to said folder
- Create a MySQL DB with XAMPP
- Create a new user or use existing user and link to DB
- On your browser window, navigate to `localhost/[htdocs-folder-name]`
- Enter the username, password and DB name from above
- Setup your site with the apropriate details

# Getting Started

- Delete all posts, pages and plugins
- `Settings > Permalink > Permalink structure > [x] Post name`
- `Appearance > Themes > Twenty Twenty-one`
- `Users > Profile > Admin Color Scheme	> [x] Morden`

## Plugins

- Required
  - Elementor
  - Elementor Pro
  - Custom Fonts
  - Advanced Custom Fields PRO
- Semi-optional
  - Anywhere Elementor Pro
- E-commerce
  - WooCommere

## Elementor

- `Settings > General`
  - Disable Default Colors
  - Disable Default Fonts
- `Settings > Features`
  - Inline Font Icons
  - Flexbox Container
  - Grid Container
  - Editor Top Bar
  - Lazy Load Background Images
